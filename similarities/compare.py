import numpy as np
import json
from decimal import *
import xml.etree.ElementTree as ET
from parse_musicxml import extract_element_tree, parse_et
from generate_error_mxl import generate_mxl
from classes import Note, ChordAndPosition, AllChords

def is_different(div1: int, t1: Note, div2: int, t2: Note) -> bool: 
    composite_duration1 = div1 * int(t2.duration)
    composite_duration2 = div2 * int(t1.duration)
    if composite_duration1 == composite_duration2 and t1.octave == t2.octave and t1.step == t2.step:
        return False
    return True

def notes_is_same(div1: int, t1: ChordAndPosition, div2: int, t2: ChordAndPosition) -> bool: # chords are in format (measure, duration, list of notes played at that moment)
    # TODO: make it smarter (ie able to tell when its just audio-xml messing up)
    if len(t1.notes) != len(t2.notes): # check if notes are different 
        return False
    for i in range(0, len(t1.notes)):
        if is_different(div1, t1.notes[i], div2, t2.notes[i]):
            return False
    return True

def compare(file1: str, file2: str) -> list: 
    # file1 = audio recording -> midi -> musicxml, file 2 = sheet music omr
    tree1 = extract_element_tree(file1)
    tree2 = extract_element_tree(file2)
    list1 = parse_et(tree1)
    list2 = parse_et(tree2)
    for i in list1.allChords:
        print(i)
    print('------------ break ------------')
    for i in list2.allChords:
        print(i)
    print('------------ start comparison -----------')
    table = np.zeros((len(list1.allChords) + 1, len(list2.allChords) + 1)) # using levenshtein distance algorithm to determine differences in the two created files of music, rows = sheet music, cols = audio parsing
    for i in range(1, len(list1.allChords) + 1):
        for j in range(1, len(list2.allChords) + 1):
            if i == 1:
                table[(i - 1, j)] = j
            if j == 1:
                table[(i, j - 1)] = i
            subCost = 1
            if notes_is_same(list1.divisions, list1.allChords[i - 1], list2.divisions, list2.allChords[j - 1]):
                subCost = 0
            table[(i, j)] = min(table[(i - 1, j)] + 1, table[(i, j - 1)] + 1, table[(i - 1, j - 1)] + subCost)

    print(table)

    row = len(list1.allChords) # begin backtrack to determine where errors were made and return list
    col = len(list2.allChords)
    
    levenshtein_distance = str(float(1 - Decimal(table[(row, col)]) / Decimal(len(list2.allChords)))) # levenshtein distance value
    errors = []
    while row > 0 and col > 0:
        diag = table[(row - 1, col - 1)]
        up = table[(row - 1, col)]
        left = table[(row, col - 1)]
        cur = table[(row, col)]
        if diag <= up and diag <= left and diag <= cur:
            row -= 1
            col -= 1
            if diag == cur - 1: #case where note should be replaced, wrong note was played
                errors.insert(0, ('replace', list1.allChords[row], list2.allChords[col]))
            else: #no changes should be made
                continue
        elif left <= cur and left <= up: # insertion should be made, player missed a note
            col -= 1
            errors.insert(0, ('insert', list2.allChords[col]))
        else: # deletion should be made, player played an extra note
            row -= 1
            errors.insert(0, ('delete', list1.allChords[row]))
    while row > 0:
        row -= 1
        errors.insert(0, ('delete', list1.allChords[row]))
    while col > 0:
        col -= 1
        errors.insert(0, ('insert', list2.allChords[col]))
    return formatOutput(errors, list1, list2, tree1, tree2, levenshtein_distance)


def endBlock(delete: list, insert: list, recording: ET, sheet_music: ET) -> json:
    if len(insert) == 0 and len(delete) != 0:
        delete_mxl = generate_mxl(delete, None, recording, sheet_music)
        print('delete error: ' + delete_mxl)
        return ({
            'errorType': 'delete',
            'delete': delete,
            'deleteMusicXML': delete_mxl
        })
    elif len(insert) != 0 and len(delete) == 0:
        insert_mxl = generate_mxl(None, insert, recording, sheet_music)
        print('insert error: ' + insert_mxl)
        return ({
            'errorType': 'insert',
            'insert': insert,
            'insertMusicXML': insert_mxl
        })
    elif len(insert) != 0 and len(delete) != 0:
        delete_mxl = generate_mxl(delete, None, recording, sheet_music)
        insert_mxl = generate_mxl(None, insert, recording, sheet_music)
        print('replace error: ' + delete_mxl + ' ' + insert_mxl)
        return ({
            'errorType': 'replace',
            'delete': delete,
            'insert': insert, 
            'deleteMusicXML': delete_mxl,
            'insertMusicXML': insert_mxl
        })
    else:
        raise Exception('shits not a proper error')

def toJson(chord: ChordAndPosition, divisions: int) -> json:
    to_return = {}
    to_return['measure'] = chord.measure
    to_return['startBeat'] = float(Decimal(chord.start_duration) / Decimal(divisions))
    to_return['notes'] = []
    for note in chord.notes:
        new_note = {}
        new_note['duration'] = float(Decimal(note.duration) / Decimal(divisions))
        new_note['note'] = '' + note.step + note.octave
        to_return['notes'].append(new_note)
    return to_return
    

def formatOutput(errors: list[tuple], list1: AllChords, list2: AllChords, recording_tree: ET, sheet_music_tree: ET, grade: str) -> tuple[str, list]:
    to_return = []
    for error in errors:
        if error[0] == 'replace':
            print('replace: ' + str(error[1]) + ' ' + str(error[2]))
        elif error[0] == 'insert':
            print('insert: ' + str(error[1]))
        elif error[0] == 'delete':
            print('delete: ' + str(error[1]))
    if len(errors) == 0:
        return []
    cur_error = 0
    cur_rec_pos = 0
    insert = []
    delete = []
    while cur_error < len(errors) and cur_rec_pos < len(list1.allChords):
        print('cur_error: ' + str(cur_error) + ' cur_rec_pos: ' + str(cur_rec_pos))
        if notes_is_same(list1.divisions, errors[cur_error][1], list1.divisions, list1.allChords[cur_rec_pos]):
            if errors[cur_error][0] == 'replace':
                insert.append(toJson(errors[cur_error][2], list1.divisions))
                delete.append(toJson(errors[cur_error][1], list1.divisions))
            elif errors[cur_error][0] == 'insert':
                insert.append(toJson(errors[cur_error][1], list1.divisions))
            elif errors[cur_error][0] == 'delete':
                delete.append(toJson(errors[cur_error][1], list1.divisions))
            cur_error += 1
        else:
            if len(insert) != 0 or len(delete) != 0:
                to_return.append(endBlock(delete, insert, recording_tree, sheet_music_tree))
            insert = []
            delete = []
        cur_rec_pos += 1
    while cur_error < len(errors):
        if errors[cur_error][0] == 'replace':
            insert.append(toJson(errors[cur_error][2], list1.divisions))
            delete.append(toJson(errors[cur_error][1], list1.divisions))
        elif errors[cur_error][0] == 'insert':
            insert.append(toJson(errors[cur_error][1], list1.divisions))
        elif errors[cur_error][0] == 'delete':
            delete.append(toJson(errors[cur_error][1], list1.divisions))
        cur_error += 1

    if len(insert) != 0 or len(delete) != 0:
        to_return.append(endBlock(delete, insert, recording_tree, sheet_music_tree))

    return (grade, to_return)

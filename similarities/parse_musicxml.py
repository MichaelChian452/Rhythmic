import xml.etree.ElementTree as ET
import zipfile
import os
from classes import Note, ChordAndPosition, AllChords

def extract_element_tree(file: str) -> ET:
    print('extracting etree of: ' + file)
    tree = None
    if file.endswith(('.musicxml', '.xml')):
        # if file is unzipped as a .musicxml file, then we don't need to unzip
        tree = ET.parse(file)
    elif file.endswith('.mxl'):
        # if file is zipped as a .mxl file, then this will unzip into regular xml file
        path = os.path.dirname(file)
        fName = '/' + os.path.splitext(os.path.basename(file))[0]
        with zipfile.ZipFile(file,"r") as zip_ref:
            zip_ref.extractall(path)
        if os.path.isfile(path + '/score.xml'):
            tree = ET.parse(path + '/score.xml')
        elif os.path.isfile(path + fName + '.xml'):
            tree = ET.parse(path + fName + '.xml')
        else:
            raise Exception('file: [' + path + '] not found')
    else:
        raise Exception('Provided file: ' + file + ' is not supported. File type should be .musicxml or .mxl')
    return tree.getroot()

def parse_et(root: ET) -> AllChords:
    allnotes = []
    measure_num = 1
    divisions = -1 # the number of divisons to one quarter note throughout this piece
    # key = 0 # key measured in fifths, ie 0 = C, 1 = G, -1 = F, etc
    for part in root.findall('part'):
        for measure in part.findall('measure'):
            if measure_num == 1:
                divisions = int(measure.find('attributes').find('divisions').text)
                # key = int(measure.find('attributes').find('key').find('fifths').text)
            voice = 1
            duration = 0
            prev_added_duration = 0
            cur_measure_notes = {} # dictionary of keys = duration, values = Note (note duration, note step, note octave, note staff), all values are str
            for note in measure.findall('note'):
                if int(note.find('voice').text) != voice:
                    duration = 0
                    voice = int(note.find('voice').text)
                if note.find('pitch') is not None: # if the note is a rest
                    if duration not in cur_measure_notes:
                        cur_measure_notes[duration] = []
                    new_note = Note(note.find('duration').text, note.find('pitch').find('step').text, note.find('pitch').find('octave').text)
                    if note.find('chord') is not None:
                        cur_measure_notes[duration - prev_added_duration].append(new_note)
                    else:
                        cur_measure_notes[duration].append(new_note)
                if note.find('chord') is None:
                    duration += int(note.find('duration').text)
                    prev_added_duration = int(note.find('duration').text)
            for i in sorted(cur_measure_notes.keys()):
                new_chord = ChordAndPosition(measure_num, i, cur_measure_notes[i])
                allnotes.append(new_chord)
            measure_num += 1
    combined_piece = AllChords(divisions, allnotes)
    return combined_piece

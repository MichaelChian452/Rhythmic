from parse_musicxml import extract_element_tree, parse_et
import numpy as np

def compare(file1: str, file2: str) -> list: 
    # file1 = audio recording -> midi -> musicxml, file 2 = sheet music omr
    tree1 = extract_element_tree(file1)
    tree2 = extract_element_tree(file2)
    list1 = parse_et(tree1)
    list2 = parse_et(tree2)
    table = np.zeros((len(list1) + 1, len(list2) + 1)) # using levenshtein distance algorithm to determine differences in the two created files of music, rows = sheet music, cols = audio parsing
    for i in range(1, len(list1) + 1):
        for j in range(1, len(list2) + 1):
            if i == 1:
                table[(i - 1, j)] = j
            if j == 1:
                table[(i, j - 1)] = i
            subCost = 1
            if notes_is_same(list1[i - 1], list2[j - 1]):
                subCost = 0
            table[(i, j)] = min(table[(i - 1, j)] + 1, table[(i, j - 1)] + 1, table[(i - 1, j - 1)] + subCost)

    row = len(list1) # begin backtrack to determine where errors were made and return list
    col = len(list2)
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
                errors.insert(0, ('replace', list1[row], list2[col]))
            else: #no changes should be made
                continue
        elif left <= cur and left <= up: # insertion should be made, player missed a note
            col -= 1
            errors.insert(0, ('insert', list2[col]))
        else: # deletion should be made, player played an extra note
            row -= 1
            errors.insert(0, ('delete', list1[row]))
    while row > 0:
        row -= 1
        errors.insert(0, ('delete', list1[row]))
    while col > 0:
        col -= 1
        errors.append(('insert', list2[col]))
    print(errors)
    return errors

def notes_is_same(t1: tuple, t2: tuple) -> bool: # tuples are in format (measure, duration, list of notes played at that moment)
    # if t1[0] != t2[0]: # check if measures are equal
    #     return False
    # if t1[1] != t2[1]: # check if duration is equal
    #     return False
    if len(t1[2]) != len(t2[2]): # check if notes are different TODO: make it smarter (ie able to tell when its just audio-xml messing up)
        return False
    for i in range(0, len(t1[2])):
        if t1[2][i] != t2[2][i]:
            return False
    return True
compare('compare-tests/multiple-errors.mxl', 'compare-tests/c-major-scale.mxl')
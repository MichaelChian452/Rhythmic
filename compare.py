from parse_musicxml import extract_element_tree, parse_et
import numpy as np

def compare(file1: str, file2: str) -> list: 
    # file1 = sheet music omr, file2 = audio recording -> midi -> musicxml
    tree1 = extract_element_tree(file1)
    tree2 = extract_element_tree(file2)
    list1 = parse_et(tree1)
    list2 = parse_et(tree2)
    table = np.zeros(len(list1) + 1, len(list2) + 1) # using levenshtein distance algorithm to determine differences in the two created files of music, rows = sheet music, cols = audio parsing
    for i in range(0, len(list1)):
        for j in range(0, len(list2)):
            subCost = 1
            if notes_is_same(list1[i], list2[j]):
                subCost = 0
            table[(i + 1, j + 1)] = min(table[(i, j + 1)] + 1, table[(i + 1, j)] + 1, table[(i, j)] + subCost)
    row = len(list1)
    col = len(list2)
    errors = []
    while row != 0 and col != 0:
        # TODO: finish the traceback and figure out where the values were incremented: these positions are where there are differences
    print(table)

def notes_is_same(t1: tuple, t2: tuple) -> bool: # tuples are in format (measure, duration, list of notes played at that moment)
    if t1[0] != t2[0]: # check if measures are equal
        return False
    elif t1[1] != t2[1]: # check if duration is equal
        return False
    elif len(t1[2]) != len(t2[2]): # check if notes are different TODO: make it smarter (ie able to tell when its just audio-xml messing up)
        return False
    for i in range(0, len(t1[2])):
        if t1[2][i] != t2[2][i]:
            return False
    return True
compare('woo', 'w')
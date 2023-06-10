import xml.etree.ElementTree as ET
import zipfile

def extract_element_tree(file: str) -> ET:
    # if file is zipped as a .mxl file, then this will unzip into regular xml file
    #with zipfile.ZipFile("testing/oompa3.mxl","r") as zip_ref:
    #    zip_ref.extractall("testing")
    #tree = ET.parse('testing/oompa3.xml')

    # if file is unzipped as a .musicxml file, then we don't need to unzip
    tree = ET.parse('testing/nr.musicxml')

    return tree.getroot()

def parse_et(root: ET) -> list:
    allnotes = []
    measure_num = 1
    divisions = -1 # the number of divisons to one quarter note throughout this piece
    key = 0 # key measured in fifths, ie 0 = C, 1 = G, -1 = F, etc
    for part in root.findall('part'):
        for measure in part.findall('measure'):
            if measure_num == 1:
                divisions = int(measure.find('attributes').find('divisions').text)
                print(divisions)
                key = int(measure.find('attributes').find('key').find('fifths').text)
            voice = 1
            duration = 0
            cur_measure_notes = {} # dictionary of keys = duration, values = tuple (note duration, note step, note octave, note staff), all values are str
            for note in measure.findall('note'):
                if int(note.find('voice').text) != voice:
                    duration = 0
                    voice = int(note.find('voice').text)
                if note.find('pitch') is not None: # if the note is a rest
                    if duration not in cur_measure_notes:
                        cur_measure_notes[duration] = []
                    cur_measure_notes[duration].append((note.find('duration').text, note.find('pitch').find('step').text, note.find('pitch').find('octave').text, note.find('staff').text))
                duration += int(note.find('duration').text)
            for i in sorted(cur_measure_notes.keys()):
                allnotes.append((measure_num, i, cur_measure_notes[i]))
            measure_num += 1
    return allnotes


root_of_tree = extract_element_tree('waa')
print(parse_et(root_of_tree))
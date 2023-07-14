import xml.etree.ElementTree as ET
import json
import os
import uuid

from parse_musicxml import extract_element_tree

def generate_mxl(delete: list, insert: list, recording: ET, sheet_music: ET) -> str:
    metadata = '<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 4.0 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd">\n'
    root = ET.Element('score-partwise')
    init_measure = -1
    end_measure = -1
    src_musicxml = None
    if delete != None:
        init_measure = delete[0]['measure']
        end_measure = delete[len(delete) - 1]['measure']
        src_musicxml = recording
    elif insert != None: 
        init_measure = insert[0]['measure']
        end_measure = insert[len(insert) - 1]['measure']
        src_musicxml = sheet_music
        
    root.attrib = src_musicxml.attrib
    for src_element in src_musicxml:
        if src_element.tag == 'identification' or src_element.tag == 'part-list':
            root.append(src_element)
    cnt = 1
    for part in src_musicxml.findall('part'):
        new_part = ET.Element('part')
        new_part.attrib = {'id': 'P' + str(cnt)}
        for measure in part.findall('measure'):
            if int(measure.attrib['number']) > end_measure:
                break
            if int(measure.attrib['number']) >= init_measure and int(measure.attrib['number']) <= end_measure:
                new_part.append(measure)
            elif measure.attrib['number'] == '1':
                first = ET.Element('measure')
                first.attrib = {'number': '1'}
                print(first.attrib)
                first.append(measure['attributes'])
                first.append(measure['direction'])
                print(first)
                new_part.append(first)
        root.append(new_part)
        cnt += 1
    
    assets_file_path = os.path.dirname(os.path.abspath(__file__)) + '/../data/assets/errors/'
    file_name = str(uuid.uuid1()) + '.xml'
    full_path = assets_file_path + file_name
    tree = ET.ElementTree(root)
    with open(full_path, mode='w') as f:
        f.write(metadata)
        tree.write(f, encoding='unicode')
    print('successfully wrote error et to path: ' + full_path)
    return file_name

# path = os.path.dirname(os.path.abspath(__file__)) + '/../rhythmic-web-app/json/projects.json'
# with open(path, 'r') as f:
#     data = json.load(f)
# del_err = data['projects'][1]['recordings'][0]['grade'][0]['delete']
# ins_err = data['projects'][1]['recordings'][0]['grade'][0]['insert']
# rec = extract_element_tree('C:\\Users\\Michael\\Documents\\rhythmic\\data\\mscore-output\\3-2-recording-0818823d563bf6882fa3d1da199167c2.musicxml')
# sm = extract_element_tree("C:\\Users\\Michael\\Documents\\rhythmic\\data\\audiveris-output\\3-sheet-music-img-f270347ac6e776f9f786763f015d2dfb.mxl")
# generate_mxl(del_err, None, rec, sm)
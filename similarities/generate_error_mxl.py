import xml.etree.ElementTree as ET
import json
import os
from parse_musicxml import extract_element_tree, parse_et

def generate_mxl(error: json, recording: ET, sheet_music: ET) -> None:
    # metadata = '<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 4.0 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd">\n'
    root = ET.Element('score-partwise')
    root.attrib = recording.attrib
    for src_element in recording:
        if src_element.tag == 'identification' or src_element.tag == 'part-list':
            root.append(src_element)

    if len(error['delete']) != 0:
        delete_init_measure = error['delete'][0]['measure']
        delete_end_measure = error['delete'][len(error['delete']) - 1]['measure']
        cnt = 1
        for part in recording.findall('part'):
            new_part = ET.Element('part')
            new_part.attrib = {'id': 'P' + str(cnt)}
            for measure in part.findall('measure'):
                if int(measure.attrib['number']) > delete_end_measure:
                    break
                if int(measure.attrib['number']) >= delete_init_measure and int(measure.attrib['number']) <= delete_end_measure:
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
    

    tree = ET.ElementTree(root)
    tree.write('test.xml')


path = os.path.dirname(os.path.abspath(__file__)) + '/../rhythmic-web-app/json/projects.json'
with open(path, 'r') as f:
    data = json.load(f)
err = data['projects'][1]['recordings'][0]['grade'][0]
rec = extract_element_tree('C:\\Users\\Michael\\Documents\\rhythmic\\data\\mscore-output\\3-2-recording-0818823d563bf6882fa3d1da199167c2.musicxml')
generate_mxl(err, rec, None)
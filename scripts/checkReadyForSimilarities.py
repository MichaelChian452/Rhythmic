import time
import json
import os
import sys

sys.path.insert(1, './../similarities')
from compare import compare

from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler



class Watcher:

    def __init__(self, directory, handler=FileSystemEventHandler()):
        self.observer = Observer()
        self.handler = handler
        self.directory = directory

    def run(self):
        self.observer.schedule(
            self.handler, self.directory, recursive=True)
        self.observer.start()
        print('watcher running in: ' + self.directory)
        try:
            while True:
                time.sleep(1)
        except:
            self.observer.stop()
        self.observer.join()
        print('watcher stopped')

class uploadHandler(FileSystemEventHandler):

    def rightExtension(self, fileName: str) -> bool:
        if fileName.endswith('.mxl'):
            return True
        elif fileName.endswith('.musicxml'):
            return True
        return False
    
    def runAndFormatSimilarityTest(self, file1: str, file2: str):
        # file1 = sheet music xml, file2 = audio xml
        res = compare(file2, file1)
        print('---------- returned to watcher --------------')
        for error in res:
            print(error)
        return res

    def on_any_event(self, event):
        time.sleep(1)
        print(event)
        filePath = os.path.abspath(event.src_path)
        jsonPath = './../rhythmic-web-app/json/projects.json'
        if event.event_type == 'created':
            if 'audiveris-output' in event.src_path:
                fileName = os.path.basename(filePath)
                print('new audiveris output detected: ' + filePath)
                if self.rightExtension(fileName):
                    print('continue with writing because is mxl file')
                    projectId = fileName.split('-')[0]
                    with open(jsonPath) as jsonFile:
                        contents = jsonFile.read()
                    parsedJson = json.loads(contents)
                    found = False
                    for proj in parsedJson['projects']:
                        if proj['id'] == projectId:
                            proj['sheet-music-mxl'] = filePath
                            found = True
                            break
                    if not found:
                        raise Exception('the file: ' + filePath + ' was unable to be matched to a project')
                    with open(jsonPath, 'w') as f:
                        json.dump(parsedJson, f, indent=4)

            elif 'mscore-output' in event.src_path:
                fileName = os.path.basename(filePath)
                print('new musescore output detected: ' + filePath)
                if self.rightExtension(fileName):
                    print('continue with writing because is mxl file')
                    projectId = fileName.split('-')[0]
                    recordingId = fileName.split('-')[1]
                    with open(jsonPath) as jsonFile:
                        contents = jsonFile.read()
                    parsedJson = json.loads(contents)
                    found = False
                    for proj in parsedJson['projects']:
                        if proj['id'] == projectId:
                            for recording in proj['recordings']:
                                if recording['id'] == recordingId:
                                    recording['recording-mxl'] = filePath
                                    found = True
                                    recording['grade'] = self.runAndFormatSimilarityTest(proj['sheet-music-mxl'], filePath)
                                    break
                            break
                    if not found:
                        raise Exception('the file: ' + filePath + ' was unable to be matched to a project')
                    with open(jsonPath, 'w') as f:
                        json.dump(parsedJson, f, indent=4)


if __name__ == '__main__':
    watcher = Watcher('./../data', uploadHandler())
    watcher.run()
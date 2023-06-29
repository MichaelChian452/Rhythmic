class Note:
    def __init__(self, duration: int, step: int, octave: str) -> None:
        self.duration = duration
        self.step = step
        self.octave = octave
        
    def __str__(self):
        return f"<Note [{self.duration}] [{self.step}] [{self.octave}]>"

class ChordAndPosition:
    def __init__(self, measure: int, duration: int, notes: list[Note]) -> None:
        self.measure = measure
        self.start_duration = duration
        self.notes = notes

    def __str__(self):
        notes_str = ''
        for note in self.notes:
            notes_str += str(note)
        return f"<Chord measure: [{self.measure}] [{self.start_duration}], notes: [{notes_str}]>"

class AllChords:
    def __init__(self, divisions: int, allChords: list[ChordAndPosition]) -> None:
        self.divisions = divisions
        self.allChords = allChords

    def __str__(self):
        chords_str = ''
        for chords in self.allChords:
            chords_str += str(chords)
        return f"Overall Piece: divisions: [{self.divisions}], notes: {chords_str}"
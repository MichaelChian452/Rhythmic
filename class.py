class Note:
    def __init__(self, duration: int, step: int, octave: str, staff: int) -> None:
        self.duration = duration
        self.step = step
        self.octave = octave
        self.staff = staff


class ChordAndPosition:
    def __init__(self, measure: int, duration: int, notes: list[Note]) -> None:
        self.measure = measure
        self.duration = duration
        self.notes = notes
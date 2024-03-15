const intervalSounds = ["Minor 2nd", "Major 2nd", "Minor 3rd", "Major 3rd",
    "Perfect 4th", "Tritone", "Perfect 5th", "Minor 6th",
    "Major 6th", "Minor 7th", "Major 7th", "Octave"
]

const chordSoundsFull = ["Major", "Minor", "Augmented", "Diminished",
    "Sus 2", "Sus 4", "Dominant 7th", "Major 7th",
    "Minor 7th", "Minor Major 7th", "Diminished 7th", "Half Diminished 7th",
    "Augmented 7th", "Augmented Major 7th", "Major 6th", "Minor 6th"
]

const chordSounds = ["Maj", "Min", "Aug", "Dim",
    "Sus 2", "Sus 4", "Dom 7", "Maj 7",
    "Min 7", "Min Maj 7", "Dim 7", "Half Dim 7",
    "Aug 7", "Aug Maj 7", "Maj 6", "Min 6"
]

const chordForms = [
    "CEG", "CD#G", "CEG#", "CD#F#", 
    "CDG", "CFG", "CEGA#", "CEGB",
    "CD#GA#", "CD#GB", "CD#F#A", "CD#F#A#",
    "CEG#A#", "CEG#B", "CEGA", "CD#GA"

]



const noteSounds = ["C", "C#", "D", "D#",
    "E", "F", "F#", "G", "G#", "A", "A#", "B"
]

const melodySounds = ["C", "C#", "D", "D#",
    "E", "F", "F#", "G", "G#", "A", "A#", "B"
]



const intervalPlayForms = ["Ascend", "Descend", "Ascend & Descend", "Harmonic", "All Mixed"]
const chordPlayForms = ["Harmonic", "Ascend", "Descend", "Ascend & Descend", "All Mixed"]
const notePlayForms = ["Single"]
const melodyPlayForms = ["Ascend", "Descend", "Random"]

export { intervalSounds, chordSounds, noteSounds, melodySounds }
export { intervalPlayForms, chordPlayForms, notePlayForms, melodyPlayForms, chordForms }
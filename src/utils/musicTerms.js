import { note2Number, note2NumberFull, number2Note } from "../components/playSound/playSpecific"
import { chordForm2chordArr } from "../components/playSound/playSpecific"

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

export const chordForms = [
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

export const modes = ["Major", "Minor"]

// chord progressions

export const chordArrs = chordForms.map(chordForm => chordForm2chordArr(chordForm))


export const CHORD_PROG_INIT_PARAS = {
    key: {
        options: noteSounds,
        cur: "C",
    },
    scale: {
        options: [0, 1, 2, 3, 4, 5, 6, 7],
        cur: 4,
    },
    mode: {
        options: modes,
        cur: "Major",
    },
    // pos: {
    //     options: [1, 2, 3, 4, 5, 6, 7],
    //     cur: 1,
    // }
}

export const CHORD_SINGLE_INIT_PARAS = {
    pos: {
        options: Array.from(Array(21).keys()).map(t => t + 1),
        cur: 1,
    },
    time: {
        options: [0.25, 0.33, 0.5, 1, 2, 4],
        cur: 1,
    }
}

export const generateDataForChordPara = (chordData) => {
    const pos = chordData.info.pos.cur
    const time = chordData.info.time.cur
    // console.log(nextInMode(info.mode.cur, info.key.cur, info.key.cur))
    return `Pos ${pos} Time ${time}`
}

const MAJOR_MODE = ["C", "D", "E", "F", "G", "A", "B"]
const MINOR_MODE = ["C", "D", "D#", "F", "G", "G#", "A#"]
const modeMap = new Map()
modeMap.set("Major", MAJOR_MODE)
modeMap.set("Minor", MINOR_MODE)

// next note of current note in some scale; only note, no scale involvde
export const nextInMode = (mode, curNote, key) => {
    const modeArr = modeMap.get(mode)
    const modeNumArr = modeArr.map(note => {
        return note2Number(note)
    })
    const keyNum = note2Number(key)
    const curNoteMode = modeNumArr.map(noteNum => {
        return number2Note((noteNum + keyNum + 108) % 12, false)
    })
    curNoteMode.push(curNoteMode[0])
    let bef = '*'
    for (let note of curNoteMode) {
        if (bef == curNote) return note
        bef = note
    }

}

export const getPureNote = (note) => {
    return number2Note(note2NumberFull(note), false)
}

// with scale
export const nextNoteInMode = (mode, startNote, key) => {
    let pureNote = getPureNote(startNote)
    let nextPureNote = nextInMode(mode, pureNote, key)
    nextPureNote += "0"
    while (note2NumberFull(nextPureNote) < note2NumberFull(startNote)) {
        nextPureNote = number2Note(note2NumberFull(nextPureNote) + 12)
    }
    return nextPureNote
}

// generate 3 note (a chord) with key, scale, mode, pos info
export const genChordProblemFromPos = (para, chordInfo) => {
    const pos = chordInfo.pos.cur;
    const mode = para.mode.cur
    const key = para.key.cur
    const scale = para.scale.cur
    let rootNote = key + scale
    let chordStartNote = rootNote
    for (let i = 1; i < pos; i++) {
        chordStartNote = nextNoteInMode(mode, chordStartNote, key)
    }
    // now just 3-chord in major/minor scale
    const chords = [chordStartNote]
    for (let i = 0; i < 2; i++) {
        let curNote = chords[chords.length - 1]
        for (let j = 0; j < 2; j++) curNote = nextNoteInMode(mode, curNote, key)
        chords.push(curNote)
    }
    // used when no nextNoteInMode function
    // let bef = rootNote
    // for(let [index, value] of chords.entries()) {
    //     value = value + scale
    //     while(note2NumberFull(value) < note2NumberFull(bef)) {
    //         value = number2Note(note2NumberFull(value) + 12)
    //     }
    //     chords[index] = value
    //     bef = value
    // }
    return chords
}


export { intervalSounds, chordSounds, noteSounds, melodySounds }
export { intervalPlayForms, chordPlayForms, notePlayForms, melodyPlayForms }

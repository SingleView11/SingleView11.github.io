
export const generateConfig = (obj) => {

    const { type, soundNames, playForms } = obj

    const speedInit = {
        // min and max for range
        min: 40,
        max: 280,
        cur: 120,
    }

    const playFormInit = {
        cur: 0,
        options: playForms,
    }

    const preludeInit = {
        // usePrelude: false,
        cur: 1,
        options: ["melody", "cadence", "none"]
    }

    const wrongThenInit = {
        options: ["play wrong note", "silent"],
        cur: 0,
    }

    const rightThenInit = {
        options: ["play correct note", "silent"],
        cur: 0,
    }

    const waitIntervalInit = {
        min: 0,
        max: 3,
        cur: 1,
    }

    const scaleRangeInit = {
        min: 1,
        max: 7,
        cur: 3,
    }

    // 0 for unlimited
    const questionNumberInit = {
        min: 0,
        max: 100,
        cur: 20,
    }


    const soundsInit = soundNames.map((soundName, index) => {
        // 12 modes
        return {
            name: soundName,
            playable: true,
            description: `${index + 1} semitones`,
            key: `${type}: ${index + 1}`
        }
    })

    const initConfig = {
        sounds: soundsInit,
        speed: speedInit,
        waitInterval: waitIntervalInit,
        questionNumber: questionNumberInit,


        wrongThen: wrongThenInit,
        rightThen: rightThenInit,

        playForm: playFormInit,
        prelude: preludeInit,

        scaleRange: scaleRangeInit,

        type: type,
    }

    return initConfig;
}


export const generateSpecificConfig = (obj) => {

    const { type, soundNames, playForms } = obj

    const playFormInit = {
        cur: 0,
        options: playForms,
    }

    const soundsInit = soundNames.map((soundName, index) => {
        // 12 modes
        return {
            name: soundName,
            playable: true,
            description: `${index + 1} semitones`,
            key: `${type}: ${index + 1}`
        }
    })

    const initConfig = {
        sounds: soundsInit,
        playForm: playFormInit,
        type: type,
    }

    return initConfig;

}


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

const noteSounds = ["C", "C#", "D", "D#",
    "E", "F", "F#", "G", "G#", "A", "A#", "B"
]

const melodySounds = ["C", "C#", "D", "D#",
    "E", "F", "F#", "G", "G#", "A", "A#", "B"
]



const intervalPlayForms = ["Ascend", "Descend", "Ascend & Descend", "Harmonic", "All Mixed"]
const chordPlayForms = ["Ascend", "Descend", "Ascend & Descend", "Harmonic", "All Mixed"]
const notePlayForms = ["Single"]
const melodyPlayForms = ["Ascend", "Descend", "Random"]

export {intervalSounds, chordSounds, noteSounds, melodySounds}

const uniqueProps = {
    "interval": {

    },
    "chord": {

    },
    "note": {

    },
    "melody": {

    }
}


export const initialConfig = generateConfig({ type: "Interval", soundNames: intervalSounds, playForms: intervalPlayForms })
export const intervalConfig = generateSpecificConfig({ type: "Interval", soundNames: intervalSounds, playForms: intervalPlayForms })
export const chordConfig = generateSpecificConfig({ type: "Chord", soundNames: chordSounds, playForms: chordPlayForms })
export const noteConfig = generateSpecificConfig({ type: "Note", soundNames: noteSounds, playForms: notePlayForms })
export const melodyConfig = generateSpecificConfig({ type: "Melody", soundNames: melodySounds, playForms: melodyPlayForms })

export const alterConfigDifficulty = (spd, preludeUsage, waitTime, diff, diffMap, scaleNum) => {
    const genConf = (config) => {
        return ({
            ...config,
            speed: {
                ...config.speed,
                cur: spd
            },
            prelude: {
                ...config.prelude,
                cur: preludeUsage,

            },
            waitInterval: {
                ...config.waitInterval,
                cur: waitTime
            },
            sounds:
                config.sounds.map((sound, index) => {
                    return {
                        ...sound,
                        playable: diffMap.get(sound.name) <= diff
                    }
                })
            ,
            scaleRange: {
                ...config.scaleRange,
                cur: scaleNum
            }
        })
    }
    return genConf
}

const diffMap = new Map();
const chordDiff = [1, 1, 2, 1, 1, 2, 1, 2, 3, 3, 3, 3, 3, 3, 3, 3]
const noteDiff = [1, 3, 2, 3, 2, 1, 3, 1, 3, 2, 3, 2]
const melodyDiff = [1, 3, 2, 3, 2, 1, 3, 1, 3, 2, 3, 2]
const intervalDiff = [2, 1, 2, 1, 2, 3, 1, 3, 2, 3, 2, 1]

for (let i = 0; i < 12; i++) {
    diffMap.set(noteSounds[i], noteDiff[i]);
    diffMap.set(melodySounds[i], melodyDiff[i]);
    diffMap.set(intervalSounds[i], intervalDiff[i]);
}

for (let i = 0; i < chordDiff.length; i++) {
    diffMap.set(chordSounds[i], chordDiff[i]);
}


export const easyConfig = alterConfigDifficulty(60, 0, 3, 1, diffMap, 1)
export const mediumConfig = alterConfigDifficulty(120, 1, 1, 2, diffMap, 3)
export const hardConfig = alterConfigDifficulty(180, 2, 0, 3, diffMap, 7)


const configMap = new Map();
configMap.set("chord", chordConfig)
configMap.set("interval", intervalConfig)
configMap.set("note", noteConfig)
configMap.set("melody", melodyConfig)

export { configMap }
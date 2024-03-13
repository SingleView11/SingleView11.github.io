
export const generateConfig = (obj) => {

    const { type, soundNames, playForms } = obj

    const speedInit = {
        // min and max for range
        min: 40,
        max: 280,
        cur: 120,
    }

    const playFormInit = {
        curForm: 0,
        forms: playForms,
    }

    const preludeInit = {
        usePrelude: false,
        curPrelude: 1,
        preludes: ["melody", "cadence"]
    }

    const wrongThenInit = {
        options: ["play wrong", "silent"],
        curOption: 0,
    }

    const rightThenInit = {
        options: ["play right", "silent"],
        curOption: 0,
    }

    const waitIntervalInit = {
        min: 0,
        max: 3,
        cur: 1,
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
        playForm: playFormInit,
        prelude: preludeInit,
        wrongThen: wrongThenInit,
        rightThen: rightThenInit,
        waitInterval: waitIntervalInit,
        type: type,
    }

    return initConfig;
}


const intervalSounds = ["Minor 2nd", "Major 2nd", "Minor 3rd", "Major 3rd",
    "Perfect 4th", "Tritone", "Perfect 5th", "Minor 6th",
    "Major 6th", "Minor 7th", "Major 7th", "Octave"
]

const intervalPlayForms = ["Ascend", "Descend", "Ascend & Descend", "Harmonic", "All Mixed"]


export const intervalConfig = generateConfig({ type: "Interval", soundNames: intervalSounds, playForms: intervalPlayForms })


export const alterConfigDifficulty = (spd, preludeUsage, waitTime) => {
    const genConf = (config) => {
        return ({
            ...config,
            speed: {
                ...config.speed,
                cur: spd
            },
            prelude: {
                ...config.prelude,
                usePrelude: preludeUsage,

            },
            waitInterval: {
                ...config.waitInterval,
                cur: waitTime
            }
        })
    }
    return genConf
}

export const easyConfig = alterConfigDifficulty(60, true, 3)
export const mediumConfig = alterConfigDifficulty(120, true, 1)
export const hardConfig = alterConfigDifficulty(180, false, 0)
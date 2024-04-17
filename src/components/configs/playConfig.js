import { PlayChordProg } from "../play/playChordProgressions"

export const PLAY_CHOICES = ["Chord Prog"]

const playMap = new Map()
const playConfigMap = new Map()

export const generateConfig = (spd, bpm) => {
    const genConf = (config) => {
        return ({
            ...config,
            speed: {
                ...config.speed,
                cur: spd,
            },
            noteBpm: {
                ...config.noteBpm,
                cur: bpm,
            }
        })
    }
    return genConf
}

export const briskConfig = generateConfig(0.01, 0.5)
export const defaultConfig = generateConfig(0.01, 1.5)
export const lyricismConfig = generateConfig(0.01, 3)


playMap.set(PLAY_CHOICES[0], <PlayChordProg></PlayChordProg>)
playConfigMap.set(PLAY_CHOICES[0], defaultConfig)


export { playMap, playConfigMap }
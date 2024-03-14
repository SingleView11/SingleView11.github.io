export const generateInitProgress = () => {
    return {
        rightNum: 0,
        wrongNum: 0,
        finishedNum: 0,
        currentSoundIndex: -1,
        rightSounds: new Map(),
        wrongSounds: new Map(),
        chosen: false,
        played: false,
    }
}

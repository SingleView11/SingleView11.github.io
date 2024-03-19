import { PlayChordProg } from "../play/playChordProgressions"

export const PLAY_CHOICES = ["Chord Prog"]

const playMap = new Map()

playMap.set(PLAY_CHOICES[0], <PlayChordProg></PlayChordProg>)

console.log(playMap.get(PLAY_CHOICES[0]))

export {playMap}
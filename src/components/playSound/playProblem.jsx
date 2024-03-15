
import { playSoundOnce } from "./playSingle"
export const playProblem = (obj, config) => {
/*
 const ans = {
        showName: showName,
        playForm: playForm,
        playNotes: playNotes,
    }
*/
    if(obj.playForm == 2) {
        console.log(obj.playNotes)
        playSoundOnce(obj.playNotes)
    }

}
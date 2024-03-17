
import { playSoundOnce, playSoundMulti, stopSamplerAll } from "./playSingle"

export const playProblem = (obj, config) => {
    /*
     const ans = {
            showName: showName,
            playForm: playForm,
            playNotes: playNotes,
        }
    */
    if (obj.playForm == 2) {
        stopSamplerAll()
        playSoundOnce(obj.playNotes, config.noteBpm.cur)
    }

    if (obj.playForm == 1) {
        // 
        playSoundMulti()
    }

}
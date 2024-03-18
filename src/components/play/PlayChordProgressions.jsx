import { useState } from "react"
import { modes, noteSounds } from "../../utils/musicTerms"
import { SelectGroup } from "../uiItems/selectOptions"


const INIT_PARAS = {
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
}

export const PlayChordProg = () => {
    const [para, setPara] = useState(INIT_PARAS)
    return (
        <>
            <SelectGroup para={para} setPara={setPara} ></SelectGroup>

            <p>Chord progression play...</p>
        </>
    )
}
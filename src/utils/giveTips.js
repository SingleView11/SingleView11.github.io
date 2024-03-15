
const encourageTips = [
    "If you are feeling hard, go out for a walk might help!",
    "Share your spirit to those important to you!",
    "Steady and slow, do not forget the 'slow' part ~ Please take your time, and you are not competing with others. Instead, you are trying to connect music to your inner heart and memory.",
    "Some artists consider music as carriers of emotions. Interestingly, some philosophers in ancient China 3000 years ago also hold this view."
]

export const randomElement = (arr) => {
    return arr[Math.floor(Math.random() * arr.length)]
}

export const randomTip = () => {
    return randomElement(encourageTips)
}

export function getRandomIntInclusive(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); // The maximum is inclusive and the minimum is inclusive
  }

  
export const randomNumberInRange = (rg) => {
    let ans =getRandomIntInclusive(rg.min, rg.max)
    return ans
}

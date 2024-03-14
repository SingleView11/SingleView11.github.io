
const encourageTips = [
    "If you are feeling hard, go out for a walk might help!",
    "Share your spirit to those important to you!",
    "Steady and slow, do not forget the 'slow' part ~ Please take your time, and you are not competing with others. Instead, you are trying to connect music to your inner heart and memory.",
    "Some artists consider music as carriers of emotions. Interestingly, some philosophers in ancient China 3000 years ago also hold this view."
]

export const randomTip = () => {
    return encourageTips[Math.floor(Math.random() * encourageTips.length)];
}
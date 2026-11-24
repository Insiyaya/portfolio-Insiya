import { useEffect, useState } from 'react'

const NOISE = 'ABCDEFGHKLMNPRSTXYZ0123456789/'

/* Types a line out with a few undecided characters at the leading edge. */
export function useScramble(text, still) {
  const [shown, setShown] = useState('')
  useEffect(() => {
    if (!text || still) {
      setShown(text)
      return
    }
    let frame = 0
    let start = 0
    const run = now => {
      start ||= now
      const solved = Math.floor((now - start) / 24)
      let out = text.slice(0, solved)
      for (let i = solved; i < Math.min(text.length, solved + 3); i++) {
        out += text[i] === ' ' ? ' ' : NOISE[Math.floor(Math.random() * NOISE.length)]
      }
      setShown(out)
      if (solved < text.length) frame = requestAnimationFrame(run)
    }
    frame = requestAnimationFrame(run)
    return () => cancelAnimationFrame(frame)
  }, [text, still])
  return shown
}

import { useEffect, useState } from 'react'

/* Types a line out, one letter at a time. */
export function useTyped(text, still) {
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
      const n = Math.floor((now - start) / 26)
      setShown(text.slice(0, n))
      if (n < text.length) frame = requestAnimationFrame(run)
    }
    setShown('')
    frame = requestAnimationFrame(run)
    return () => cancelAnimationFrame(frame)
  }, [text, still])
  return shown
}

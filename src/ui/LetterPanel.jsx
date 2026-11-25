import { useEffect, useRef, useState } from 'react'
import { ACRONYM } from '../data'
import { BOX, paintLetter } from '../stage/letterArt'
import { GLYPHS } from '../stage/letters'

const rgb = hex => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16))
const SCALE = 1.3

/* The letter packed with its word, as in the 3D scene, cut to the letter's outline. */
function Letter({ letter, word, color }) {
  const ref = useRef(null)
  useEffect(() => {
    let gone = false
    const draw = () => {
      if (gone) return
      const canvas = ref.current
      const image = paintLetter(letter, word, SCALE, rgb(color), [18, 6, 46])
      const left = letter === 'I' ? 66 : 0
      const span = letter === 'I' ? 234 : BOX.w
      canvas.width = Math.round(span * SCALE)
      canvas.height = image.height
      const ctx = canvas.getContext('2d')
      const shift = (BOX.x - left) * SCALE
      ctx.putImageData(image, letter === 'I' ? shift : 0, 0)
      ctx.globalCompositeOperation = 'destination-in'
      ctx.setTransform(SCALE, 0, 0, -SCALE, letter === 'I' ? -left * SCALE : -BOX.x * SCALE, image.height + BOX.y * SCALE)
      ctx.fill(new Path2D(GLYPHS[letter]), 'evenodd')
    }
    document.fonts.load("900 100px 'Archivo Variable'").then(draw, draw)
    return () => {
      gone = true
    }
  }, [letter, word, color])
  return <canvas ref={ref} className="letter-big" aria-hidden="true" />
}

/* What one letter of INSIYA stands for, and why. Arrow keys move along the name. */
export default function LetterPanel({ start }) {
  const [at, setAt] = useState(start)
  const { letter, word, line, points, color } = ACRONYM[at]

  const move = e => {
    const step = { ArrowRight: 1, ArrowLeft: -1 }[e.key]
    if (!step) return
    e.preventDefault()
    const next = (at + step + ACRONYM.length) % ACRONYM.length
    setAt(next)
    e.currentTarget.querySelectorAll('[role="tab"]')[next].focus()
  }

  return (
    <div className="letter" style={{ '--c': color }}>
      <div className="letter-tabs" role="tablist" aria-label="Letters of INSIYA" onKeyDown={move}>
        {ACRONYM.map((a, i) => (
          <button key={i} type="button" role="tab" aria-selected={i === at} aria-controls="letter-body" tabIndex={i === at ? 0 : -1} aria-label={`${a.letter} for ${a.word}`} style={{ '--c': a.color }} onClick={() => setAt(i)}>
            {a.letter}
          </button>
        ))}
      </div>
      <div id="letter-body" key={at} className="letter-body" role="tabpanel">
        <Letter letter={letter} word={word} color={color} />
        <div>
          <h2 id="panel-title" className="letter-word"><span className="sr-only">{letter} for </span>{word}</h2>
          <p className="letter-line">{line}</p>
          <ul>
            {points.map((p, i) => <li key={p} className="bullet" style={{ '--n': i }}>{p}</li>)}
          </ul>
        </div>
      </div>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { Buddy } from '../ui/kit'

const HOME = 330 // Indore is 5 h 30 min ahead of UTC, all year

const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`
function span(minutes) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return [h && plural(h, 'hour'), m && plural(m, 'minute')].filter(Boolean).join(' and ')
}

/* The local time, with the mascot on its orbit: a sun by day, a moon by night. */
export default function LocalTime() {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 10000)
    return () => clearInterval(timer)
  }, [])

  const date = new Date(now)
  const minutes = (date.getUTCHours() * 60 + date.getUTCMinutes() + HOME) % 1440
  const hour = Math.floor(minutes / 60)
  const time = `${hour % 12 || 12}:${String(minutes % 60).padStart(2, '0')} ${hour < 12 ? 'am' : 'pm'}`
  const greeting = hour >= 5 && hour < 12 ? 'Good morning' : hour >= 12 && hour < 17 ? 'Good afternoon' : 'Good evening'
  const ahead = HOME + date.getTimezoneOffset()
  const gap = ahead === 0 ? 'We share a time zone.' : `I am ${span(Math.abs(ahead))} ${ahead > 0 ? 'ahead of' : 'behind'} you.`

  // Rises on the left at six, highest at noon.
  const day = hour >= 6 && hour < 18
  const angle = (minutes / 1440 - 0.25) * Math.PI * 2
  const x = 110 - Math.cos(angle) * 96
  const y = 66 - Math.sin(angle) * 46

  return (
    <div className="hud clock" data-glow>
      <div>
        <p className="clock-hello">{greeting} from Indore</p>
        <p className="clock-time">{time}</p>
        <p className="clock-gap">{gap}</p>
      </div>
      <div className={`clock-sky ${hour >= 1 && hour < 6 ? 'is-asleep' : ''}`} aria-hidden="true">
        <svg viewBox="0 0 220 132" fill="none">
          <path d="M4 66h212" stroke="rgba(255,255,255,.22)" strokeDasharray="2 7" />
          <ellipse cx="110" cy="66" rx="96" ry="46" stroke="rgba(164,136,255,.55)" />
          <circle cx={x} cy={y} r="17" fill={day ? '#ffb14a' : '#cbbcff'} opacity=".22" />
          <circle cx={x} cy={y} r="8" fill={day ? '#ffb14a' : '#cbbcff'} />
        </svg>
        <Buddy size={80} />
      </div>
    </div>
  )
}

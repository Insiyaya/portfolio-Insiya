import { useEffect, useRef } from 'react'
import LetterPanel from './LetterPanel'
import MessageForm from './MessageForm'

/* Opens on the spot when a screen, card or plaque is clicked. Native <dialog>:
   focus is trapped, Escape closes it, and the page behind is inert. */
export default function Panel({ open, onClose }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (open && !el.open) {
      el.showModal()
      el.scrollTop = 0
      document.dispatchEvent(new Event('panel-open'))
      if (open.type === 'message') el.querySelector('[name=name]')?.focus()
    }
    if (!open && el.open) el.close()
  }, [open])

  const item = open?.item
  const isProject = open?.type === 'project'
  const title = isProject ? item?.title : item?.company
  const points = isProject ? item?.highlights : item?.points
  const live = isProject ? item?.live : item?.href
  const close = (
    <button type="button" className="panel-close" onClick={() => ref.current.close()} aria-label="Close">
      <span aria-hidden="true" />
    </button>
  )

  return (
    <dialog
      ref={ref}
      className="panel"
      aria-labelledby="panel-title"
      onClose={onClose}
      onClick={e => e.target === ref.current && ref.current.close()}
    >
      {open?.type === 'message' && (
        <div className="panel-body">
          {close}
          <div className="panel-text panel-message">
            <MessageForm titleId="panel-title" title="Send me a message" lead="Tell me about the project or the role, and I will reply by email." />
          </div>
        </div>
      )}
      {open?.type === 'letter' && (
        <div className="panel-body">
          {close}
          <LetterPanel start={item.index} />
        </div>
      )}
      {item && open.type !== 'letter' && (
        <div className="panel-body">
          {close}
          {isProject && item.shot && (
            <div className="panel-shot">
              <img src={item.shot} alt={`Home page of ${item.title}`} width="1200" height="750" />
            </div>
          )}
          <div className="panel-text">
            <h2 id="panel-title" className="display text-[clamp(2rem,5vw,3.75rem)]">{title}</h2>
            <p className="mt-3 text-lg text-violet-soft">
              {isProject ? item.kind : item.role}
              {!isProject && item.period && <span className="text-dim">, {item.period.replace('–', 'to').replace('Joined', 'joined')}</span>}
              {!isProject && item.current && <span className="ml-3 text-mint">Current</span>}
            </p>
            {isProject && <p className="mt-6 max-w-[62ch] leading-[1.7] text-soft">{item.desc}</p>}
            {isProject && (item.problem || item.outcome) && (
              <dl className="mt-7 grid gap-6 sm:grid-cols-2">
                {[['Problem', item.problem], ['Outcome', item.outcome]].map(([k, v]) => v && (
                  <div key={k}>
                    <dt className="text-sm text-dim">{k}</dt>
                    <dd className="mt-1 leading-relaxed">{v}</dd>
                  </div>
                ))}
              </dl>
            )}
            {points?.length > 0 && (
              <ul className="mt-7 max-w-[64ch] space-y-3 leading-[1.65] text-soft">
                {points.map(p => <li key={p} className="bullet">{p}</li>)}
              </ul>
            )}
            {item.tags?.length > 0 && <p className="mt-7 text-[0.9375rem] text-dim">{item.tags.join(', ')}</p>}
            {(live || item.github) && (
              <p className="mt-7 flex flex-wrap gap-3">
                {live && <a className="pill pill-solid" data-magnetic href={live} target="_blank" rel="noopener noreferrer">Open {title}</a>}
                {item.github && <a className="pill" data-magnetic href={item.github} target="_blank" rel="noopener noreferrer">View on GitHub</a>}
              </p>
            )}
          </div>
        </div>
      )}
    </dialog>
  )
}

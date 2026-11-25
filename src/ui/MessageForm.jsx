import { useEffect, useId, useRef, useState } from 'react'
import { EMAIL } from '../data'
import { sendMessage } from './sendMessage'
import './message-form.css'

const FIELDS = ['name', 'email', 'message']
const EMAIL_SHAPE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function check(field, value) {
  const text = value.trim()
  if (field === 'name') return text ? '' : 'Enter your name'
  if (field === 'message') return text ? '' : 'Write a message'
  if (!text) return 'Enter your email'
  return EMAIL_SHAPE.test(text) ? '' : 'Check your email'
}

/* Shared by the contact scene and the footer's dialog, so nothing typed is
   lost when the dialog is closed by accident. */
const draft = { name: '', email: '', message: '' }

function Field({ id, name, label, error, wide, children }) {
  return (
    <div className="msg-field" data-wide={wide || undefined}>
      <div className="msg-top">
        <label htmlFor={id}>{label}</label>
        <span id={`${id}-error`} className="msg-error">{error}</span>
      </div>
      {children({ id, name, required: true, 'aria-invalid': error ? true : undefined, 'aria-describedby': error ? `${id}-error` : undefined })}
    </div>
  )
}

/* Name, email and message, delivered without leaving the page. */
export default function MessageForm({ title, lead, titleId, onSent, children }) {
  const uid = useId()
  const form = useRef(null)
  const heading = useRef(null)
  const busy = useRef(false)
  const moved = useRef(false)
  const [values, setValues] = useState(() => ({ ...draft }))
  const [errors, setErrors] = useState({})
  const [state, setState] = useState('idle') // idle, sending, sent, busy, failed
  const sent = state === 'sent'

  // The fields come and go, so put the keyboard where the person is looking.
  useEffect(() => {
    if (sent) {
      moved.current = true
      heading.current.focus({ preventScroll: true })
    } else if (moved.current) {
      moved.current = false
      form.current.elements.message.focus({ preventScroll: true })
    }
  }, [sent])

  const change = e => {
    const { name, value } = e.target
    draft[name] = value
    setValues(v => ({ ...v, [name]: value }))
    if (errors[name] && !check(name, value)) setErrors(x => ({ ...x, [name]: '' }))
  }

  const submit = async e => {
    e.preventDefault()
    if (busy.current) return
    const found = Object.fromEntries(FIELDS.map(f => [f, check(f, values[f])]))
    setErrors(found)
    const first = FIELDS.find(f => found[f])
    if (first) {
      setState('idle')
      form.current.elements[first].focus({ preventScroll: true })
      return
    }
    if (form.current.elements.botcheck.checked) return setState('sent') // only a bot can tick it
    const clean = Object.fromEntries(FIELDS.map(f => [f, values[f].trim()]))
    busy.current = true
    setValues(clean)
    setState('sending')
    const result = await sendMessage(clean)
    busy.current = false
    setState(result)
    if (result === 'sent') {
      draft.message = ''
      onSent?.()
    }
  }

  const another = () => {
    setValues(v => ({ ...v, message: '' }))
    setState('idle')
  }

  const asEmail = `mailto:${EMAIL}?subject=${encodeURIComponent(`Hello from ${values.name.trim()}`)}&body=${encodeURIComponent(`${values.message.trim()}\n\n${values.name.trim()}`)}`
  const sending = state === 'sending'

  return (
    <div className="msg" data-state={state}>
      <h2 ref={heading} id={titleId} className="msg-title" tabIndex={-1}>
        {sent ? <>Your message <br />has been sent.</> : title}
      </h2>
      {sent ? (
        <>
          <p className="msg-lead">Thank you, {values.name.trim()}. I will reply to you at {values.email.trim()}.</p>
          <div className="msg-actions">
            <button type="button" onClick={another}>Send another message</button>
          </div>
        </>
      ) : (
        <>
          {lead && <p className="msg-lead">{lead}</p>}
          <form ref={form} onSubmit={submit} noValidate>
            <div className="msg-grid">
              <Field id={`${uid}name`} name="name" label="Name" error={errors.name}>
                {props => <input {...props} value={values.name} onChange={change} readOnly={sending} autoComplete="name" maxLength={120} placeholder="Your full name" />}
              </Field>
              <Field id={`${uid}email`} name="email" label="Email" error={errors.email}>
                {props => <input {...props} type="email" value={values.email} onChange={change} readOnly={sending} autoComplete="email" maxLength={160} placeholder="you@example.com" />}
              </Field>
              <Field id={`${uid}message`} name="message" label="Message" error={errors.message} wide>
                {props => <textarea {...props} value={values.message} onChange={change} readOnly={sending} rows={3} maxLength={3000} placeholder="Tell me about the project or role" />}
              </Field>
            </div>
            <input className="msg-trap" type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" aria-hidden="true" />
            <p className="msg-note" role="status">
              {state === 'idle' && 'All fields are required.'}
              {sending && 'Sending your message…'}
              {state === 'busy' && 'Too many messages were sent just now. Wait a minute and try again.'}
              {state === 'failed' && <>Your message was not sent. Try again, or <a href={asEmail}>send it by email</a>.</>}
            </p>
            <div className="msg-actions">
              <button type="submit" aria-disabled={sending || undefined}>{sending ? 'Sending…' : 'Send message'}</button>
              {children}
            </div>
          </form>
        </>
      )}
    </div>
  )
}

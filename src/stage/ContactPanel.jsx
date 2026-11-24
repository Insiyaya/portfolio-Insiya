import { useState } from 'react'
import { EMAIL, LINKS } from '../data'

/* The site is static, so the form writes the email and hands it to Gmail. */
export default function ContactPanel({ active }) {
  const [opened, setOpened] = useState(false)

  const submit = e => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const name = String(form.get('name')).trim()
    const message = String(form.get('message')).trim()
    const url = `${LINKS.email}&su=${encodeURIComponent(`Hello from ${name}`)}&body=${encodeURIComponent(`${message}\n\n${name}`)}`
    window.open(url, '_blank', 'noopener')
    setOpened(true)
  }

  return (
    <div className="contact" data-visible={active} inert={active ? undefined : ''} aria-hidden={!active}>
      <div className="contact-panel">
        <h2 className="contact-title">
          Have a project
          <br />
          or a role in mind?
        </h2>
        <p className="contact-lead">I&rsquo;d love to hear about it. Available for full-time roles and freelance projects.</p>
        <form onSubmit={submit}>
          <label>
            Name
            <input name="name" autoComplete="name" required maxLength={120} placeholder="Your name" />
          </label>
          <label>
            Message
            <textarea name="message" rows={3} required maxLength={1500} placeholder="What are you building?" />
          </label>
          <div className="contact-actions">
            <button type="submit">Open in Gmail</button>
            <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
          </div>
          <p className="contact-note" role="status">
            {opened ? 'Gmail opened in a new tab with your message. Press send there to finish.' : ''}
          </p>
        </form>
        <p className="contact-links">
          <a href={LINKS.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href={LINKS.github} target="_blank" rel="noopener noreferrer">GitHub</a>
        </p>
      </div>
    </div>
  )
}

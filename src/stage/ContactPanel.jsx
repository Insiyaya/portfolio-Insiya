import { EMAIL, LINKS } from '../data'
import MessageForm from '../ui/MessageForm'

export default function ContactPanel({ active, onSent }) {
  return (
    <div className="contact" data-visible={active} inert={active ? undefined : ''} aria-hidden={!active}>
      <div className="contact-panel">
        <MessageForm
          title={<>Have a project <br />or a role in mind?</>}
          lead={<>I would be glad to hear from you. I am available for full&#8209;time roles and freelance projects.</>}
          onSent={onSent}
        >
          <a className="contact-mail" href={`mailto:${EMAIL}`}>{EMAIL}</a>
          <span className="contact-links">
            <a href={LINKS.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href={LINKS.github} target="_blank" rel="noopener noreferrer">GitHub</a>
          </span>
        </MessageForm>
      </div>
    </div>
  )
}

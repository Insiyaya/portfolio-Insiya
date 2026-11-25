import { CONTACT_KEY } from '../data'

const ENDPOINT = 'https://api.web3forms.com/submit'
const PATIENCE = 15000

/* Delivers a message to the inbox behind CONTACT_KEY: 'sent', 'busy' or 'failed'. */
export async function sendMessage({ name, email, message }) {
  if (!CONTACT_KEY) {
    console.warn('CONTACT_KEY in src/data.js is empty, so messages cannot be delivered yet.')
    return 'failed'
  }
  const stop = new AbortController()
  const timer = setTimeout(() => stop.abort(), PATIENCE)
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      signal: stop.signal,
      body: JSON.stringify({
        access_key: CONTACT_KEY,
        subject: `Portfolio message from ${name}`,
        from_name: name,
        replyto: email,
        name,
        email,
        message,
      }),
    })
    if (res.status === 429) return 'busy'
    const body = await res.json()
    return res.ok && body.success === true ? 'sent' : 'failed'
  } catch {
    return 'failed'
  } finally {
    clearTimeout(timer)
  }
}

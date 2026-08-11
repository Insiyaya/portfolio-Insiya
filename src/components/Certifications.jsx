import { motion } from 'framer-motion'
import { FaAws, FaCircleCheck } from 'react-icons/fa6'
import { SectionHeader, StaggerContainer, StaggerItem, SpotlightCard } from './ui'
import { CERTS } from '../data'

function AzureIcon({ size = 24, color = '#C084FC' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M33.26 8.33l-20.8 54.63h17.1l23.2-33.5z" fill={color}/>
      <path d="M36.64 12.82L20.2 58.88 8 79.33l55.46-40.93z" fill={color} opacity="0.7"/>
      <path d="M33.68 67.07H88L52.9 10z" fill={color}/>
    </svg>
  )
}

const CERT_ICONS = {
  aws:   ({ color }) => <FaAws style={{ color, fontSize: '1.7rem' }} />,
  azure: ({ color }) => <AzureIcon color={color} size={28} />,
}

function CertCard({ cert }) {
  const IconComp = CERT_ICONS[cert.id]
  return (
    <StaggerItem>
      {/* Spinning gradient border wrapper */}
      <div className="relative rounded-2xl group overflow-hidden">
        {/* Spinning conic-gradient border — visible on hover only */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
          className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            inset: '-50%',
            background: `conic-gradient(from 0deg at 50% 50%, transparent 0deg, ${cert.color} 60deg, transparent 120deg, transparent 240deg, ${cert.color}66 300deg, transparent 360deg)`,
          }}
        />

        {/* Inner card — 1.5px gap reveals the spinning border */}
        <SpotlightCard
          glowColor={`${cert.color}1f`}
          className="relative m-[1.5px] rounded-[calc(1rem-1.5px)] border border-line"
        >
          <motion.div
            whileHover={{ y: -5 }}
            transition={{ duration: 0.25 }}
            className="relative p-6 bg-surface flex gap-5 items-start overflow-hidden"
          >
            {/* Corner glow */}
            <div
              className="absolute top-0 right-0 w-36 h-36 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{ background: `${cert.color}16` }}
            />

            {/* Icon */}
            <motion.div
              whileHover={{ scale: 1.08, rotate: -3 }}
              transition={{ duration: 0.2 }}
              className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 border relative z-10"
              style={{ background: cert.bg, borderColor: cert.border }}
            >
              {IconComp && <IconComp color={cert.color} />}
            </motion.div>

            {/* Text content */}
            <div className="relative z-10">
              <h3 className="font-display text-[1rem] font-bold tracking-[-0.02em] text-ink mb-1">{cert.name}</h3>
              <p className="text-faint text-xs mb-3">{cert.issuer} · {cert.level}</p>
              <span
                className="inline-flex items-center gap-1.5 text-[10px] font-mono tracking-[0.14em] uppercase px-2.5 py-1 rounded-md border"
                style={{ color: cert.color, background: cert.bg, borderColor: cert.border }}
              >
                <FaCircleCheck /> verified
              </span>
            </div>
          </motion.div>
        </SpotlightCard>
      </div>
    </StaggerItem>
  )
}

export default function Certifications() {
  return (
    <section id="certifications" className="relative py-24 overflow-hidden bg-void">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 50% 48% at 28% 56%, rgba(255,45,170,0.06) 0%, transparent 58%)' }}
      />

      <div className="relative max-w-3xl mx-auto px-5">
        <SectionHeader
          tag="// certifications.verified"
          title="Cloud"
          highlight="Certifications"
          sub="Industry-recognized credentials validating cloud & AI expertise"
        />
        <StaggerContainer className="grid sm:grid-cols-2 gap-4">
          {CERTS.map(c => <CertCard key={c.id} cert={c} />)}
        </StaggerContainer>
      </div>
    </section>
  )
}

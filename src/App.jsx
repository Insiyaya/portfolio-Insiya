import { useCallback, useState } from 'react'
import ShaderBackground from '@/components/ui/shader-background'
import About from './components/About'
import Credentials from './components/Credentials'
import Experience from './components/Experience'
import Footer from './components/Footer'
import Header from './components/Header'
import Process from './components/Process'
import Projects from './components/Projects'
import Skills from './components/Skills'
import Stage from './stage/Stage'
import Cursor from './ui/Cursor'
import { Wall } from './ui/kit'
import Panel from './ui/Panel'
import { usePointerFx } from './ui/usePointerFx'

export default function App() {
  // The page background sleeps while the stage covers it, and the stage sleeps
  // once it has scrolled away, so only one of them is ever using the GPU.
  const [covered, setCovered] = useState(true)
  const [panel, setPanel] = useState(null)
  const onVisible = useCallback(ratio => setCovered(ratio > 0.97), [])
  const close = useCallback(() => setPanel(null), [])
  usePointerFx()

  return (
    <>
      <a href="#about" className="skip-link">Skip to content</a>
      <ShaderBackground paused={covered} />
      <Header />
      <main>
        <Stage onVisible={onVisible} onOpen={setPanel} />
        <div className="details">
          <About />
          <Wall rows={[['AI AGENTS', 'FASTAPI', 'LANGCHAIN', 'AWS'], ['REACT', 'NEXT.JS', 'FLUTTER', 'DYNAMODB']]} />
          <Experience />
          <Projects onOpen={setPanel} />
          <Skills />
          <Process />
          <Credentials />
        </div>
      </main>
      <Footer onOpen={setPanel} />
      <Panel open={panel} onClose={close} />
      <Cursor ribbon={!covered} />
    </>
  )
}

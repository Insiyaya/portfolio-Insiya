import { useEffect } from 'react'

/* One listener for every hover effect on the page.
 *   data-glow      sets --mx / --my, the cursor position inside the element
 *   data-tilt      also sets --rx / --ry, a 3D tilt toward the cursor
 *   data-magnetic  pulls the element a little toward the cursor */
export function usePointerFx() {
  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let tile = null
    let magnet = null

    const leaveTile = () => {
      tile?.style.setProperty('--rx', '0deg')
      tile?.style.setProperty('--ry', '0deg')
      tile = null
    }
    const leaveMagnet = () => {
      magnet?.style.removeProperty('translate')
      magnet = null
    }
    const move = e => {
      const el = e.target instanceof Element ? e.target : null
      const nextTile = el?.closest('[data-tilt], [data-glow]') ?? null
      if (nextTile !== tile) {
        leaveTile()
        tile = nextTile
      }
      if (tile) {
        const r = tile.getBoundingClientRect()
        const px = (e.clientX - r.left) / r.width
        const py = (e.clientY - r.top) / r.height
        tile.style.setProperty('--mx', `${(px * 100).toFixed(1)}%`)
        tile.style.setProperty('--my', `${(py * 100).toFixed(1)}%`)
        if (tile.hasAttribute('data-tilt') && !calm) {
          const max = Number(tile.dataset.tilt) || 8
          tile.style.setProperty('--ry', `${((px - 0.5) * 2 * max).toFixed(2)}deg`)
          tile.style.setProperty('--rx', `${((0.5 - py) * 2 * max).toFixed(2)}deg`)
        }
      }
      const nextMagnet = calm ? null : el?.closest('[data-magnetic]') ?? null
      if (nextMagnet !== magnet) {
        leaveMagnet()
        magnet = nextMagnet
      }
      if (magnet) {
        const r = magnet.getBoundingClientRect()
        const dx = e.clientX - (r.left + r.width / 2)
        const dy = e.clientY - (r.top + r.height / 2)
        magnet.style.translate = `${(dx * 0.28).toFixed(1)}px ${(dy * 0.34).toFixed(1)}px`
      }
    }
    const out = e => {
      if (e.relatedTarget) return
      leaveTile()
      leaveMagnet()
    }
    document.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerout', out, { passive: true })
    return () => {
      document.removeEventListener('pointermove', move)
      document.removeEventListener('pointerout', out)
    }
  }, [])
}

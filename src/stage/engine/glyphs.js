import { ExtrudeGeometry, ShapePath } from 'three'
import { CAP, GLYPHS } from '../letters'

function toShapes(d) {
  const path = new ShapePath()
  for (const [, cmd, args] of d.matchAll(/([MLQZ])([^MLQZ]*)/g)) {
    const n = args.trim() ? args.trim().split(/[\s,]+/).map(Number) : []
    if (cmd === 'M') path.moveTo(n[0], n[1])
    else if (cmd === 'L') path.lineTo(n[0], n[1])
    else if (cmd === 'Q') path.quadraticCurveTo(n[0], n[1], n[2], n[3])
    else path.currentPath.closePath()
  }
  return path.toShapes()
}

/* Extruded letter, centred on its own middle, `height` world units tall. */
export function letterGeometry(char, height = 1.4, depth = 0.4) {
  const k = height / CAP
  const geo = new ExtrudeGeometry(toShapes(GLYPHS[char]), {
    depth: depth / k,
    curveSegments: 10,
    bevelEnabled: true,
    bevelThickness: 9,
    bevelSize: 7,
    bevelSegments: 2,
  })
  geo.scale(k, k, k)
  geo.center()
  return geo
}

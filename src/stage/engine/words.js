import { CanvasTexture, LinearMipmapLinearFilter, SRGBColorSpace } from 'three'
import { BOX, paintLetter } from '../letterArt'

/* The face of one letter, packed with the word it stands for. Extruded faces
   use the glyph's own coordinates as UVs, so the texture is scaled to match. */
export function wordTexture(char, word) {
  const image = paintLetter(char, word, 1, [255, 255, 255], [20, 8, 52])
  const canvas = document.createElement('canvas')
  canvas.width = image.width
  canvas.height = image.height
  canvas.getContext('2d').putImageData(image, 0, 0)
  const tex = new CanvasTexture(canvas)
  tex.colorSpace = SRGBColorSpace
  tex.anisotropy = 8
  tex.minFilter = LinearMipmapLinearFilter
  tex.repeat.set(1 / BOX.w, 1 / BOX.h)
  tex.offset.set(-BOX.x / BOX.w, -BOX.y / BOX.h)
  return tex
}

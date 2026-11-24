import { ExtrudeGeometry, ShapePath } from 'three'

/* Outlines of the five letters in the name, taken from Archivo (SIL OFL) at
   weight 850 / width 112. Keeping only these glyphs avoids shipping a font
   parser and a full typeface to the browser. */
const CAP = 688
const GLYPHS = {
  I: 'M76 0L76 688L290 688L290 0Z',
  N: 'M76 0L76 688L262 688L550 395Q558 386 570.5 371.5Q583 357 596.5 342Q610 327 620 317L627 318Q626 337 626 362Q626 387 626 405L626 688L823 688L823 0L640 0L347 298Q329 318 310.5 338Q292 358 280 371L273 371Q274 355 274 333Q274 311 274 291L274 0Z',
  S: 'M413 -12Q338 -12 271 -1.5Q204 9 153.5 34.5Q103 60 74 105Q45 150 45 217Q45 219 45 223Q45 227 46 230L252 230Q250 226 250 222.5Q250 219 250 215Q250 185 268.5 167.5Q287 150 320 143Q353 136 397 136Q415 136 434.5 138Q454 140 471.5 142.5Q489 145 502.5 151.5Q516 158 524 167Q532 176 532 191Q532 211 512.5 223.5Q493 236 459 243.5Q425 251 383 258Q341 265 295.5 273.5Q250 282 208 297Q166 312 132 336Q98 360 78.5 396.5Q59 433 59 485Q59 543 85.5 583.5Q112 624 158.5 650Q205 676 266.5 688Q328 700 397 700Q467 700 527 687.5Q587 675 632 650Q677 625 702.5 585.5Q728 546 729 491L729 479L526 479L526 484Q526 504 512.5 520.5Q499 537 472 547Q445 557 404 557Q362 557 333 551Q304 545 290 533Q276 521 276 506Q276 487 296 474.5Q316 462 350 454.5Q384 447 426 440Q468 433 513 425Q558 417 600 403Q642 389 676 366Q710 343 730 307.5Q750 272 750 222Q750 140 706 87.5Q662 35 586.5 11.5Q511 -12 413 -12Z',
  Y: 'M317 0L317 272L13 688L259 688L424 444L431 444L597 688L831 688L529 272L529 0Z',
  A: 'M10 0L304 688L546 688L839 0L612 0L571 105L268 105L229 0ZM327 256L514 256L466 383Q463 394 457.5 410Q452 426 446 444.5Q440 463 434.5 480.5Q429 498 425 512L417 512Q412 493 404 470Q396 447 388 423.5Q380 400 374 383Z',
}

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

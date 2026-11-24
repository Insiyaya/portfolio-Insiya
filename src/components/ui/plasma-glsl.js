/* Flowing plasma lines, from the "shader-background" component by minhxthanh on
   21st.dev. Kept as one function so the page background and the 3D stage draw
   exactly the same animation. Returns display-referred (sRGB) colour. */
export const PLASMA_GLSL = /* glsl */ `
const float overallSpeed = 0.2;
const float gridSmoothWidth = 0.015;
const float scale = 5.0;
const vec4 lineColor = vec4(0.4, 0.2, 0.8, 1.0);
const float minLineWidth = 0.01;
const float maxLineWidth = 0.2;
const float lineSpeed = 1.0 * overallSpeed;
const float lineAmplitude = 1.0;
const float lineFrequency = 0.2;
const float warpSpeed = 0.2 * overallSpeed;
const float warpFrequency = 0.5;
const float warpAmplitude = 1.0;
const float offsetFrequency = 0.5;
const float offsetSpeed = 1.33 * overallSpeed;
const float minOffsetSpread = 0.6;
const float maxOffsetSpread = 2.0;
const int linesPerGroup = 16;

#define drawCircle(pos, radius, coord) smoothstep(radius + gridSmoothWidth, radius, length(coord - (pos)))
#define drawSmoothLine(pos, halfWidth, t) smoothstep(halfWidth, 0.0, abs(pos - (t)))
#define drawCrispLine(pos, halfWidth, t) smoothstep(halfWidth + gridSmoothWidth, halfWidth, abs(pos - (t)))

float wave(float t) {
  return (cos(t) + cos(t * 1.3 + 1.3) + cos(t * 1.4 + 1.4)) / 3.0;
}

float plasmaY(float x, float horizontalFade, float offset, float time) {
  return wave(x * lineFrequency + time * lineSpeed) * horizontalFade * lineAmplitude + offset;
}

vec3 plasma(vec2 fragCoord, vec2 resolution, float time) {
  vec2 uv = fragCoord / resolution;
  vec2 space = (fragCoord - resolution / 2.0) / resolution.x * 2.0 * scale;

  float horizontalFade = 1.0 - (cos(uv.x * 6.28) * 0.5 + 0.5);
  float verticalFade = 1.0 - (cos(uv.y * 6.28) * 0.5 + 0.5);

  space.y += wave(space.x * warpFrequency + time * warpSpeed) * warpAmplitude * (0.5 + horizontalFade);
  space.x += wave(space.y * warpFrequency + time * warpSpeed + 2.0) * warpAmplitude * horizontalFade;

  vec4 lines = vec4(0.0);
  vec4 bgColor1 = vec4(0.1, 0.1, 0.3, 1.0);
  vec4 bgColor2 = vec4(0.3, 0.1, 0.5, 1.0);

  for (int l = 0; l < linesPerGroup; l++) {
    float normalizedLineIndex = float(l) / float(linesPerGroup);
    float offsetTime = time * offsetSpeed;
    float offsetPosition = float(l) + space.x * offsetFrequency;
    float rand = wave(offsetPosition + offsetTime) * 0.5 + 0.5;
    float halfWidth = mix(minLineWidth, maxLineWidth, rand * horizontalFade) / 2.0;
    float offset = wave(offsetPosition + offsetTime * (1.0 + normalizedLineIndex)) * mix(minOffsetSpread, maxOffsetSpread, horizontalFade);
    float linePosition = plasmaY(space.x, horizontalFade, offset, time);
    float line = drawSmoothLine(linePosition, halfWidth, space.y) / 2.0 + drawCrispLine(linePosition, halfWidth * 0.15, space.y);

    float circleX = mod(float(l) + time * lineSpeed, 25.0) - 12.0;
    vec2 circlePosition = vec2(circleX, plasmaY(circleX, horizontalFade, offset, time));
    float circle = drawCircle(circlePosition, 0.01, space) * 4.0;

    lines += (line + circle) * lineColor * rand;
  }

  vec4 color = mix(bgColor1, bgColor2, uv.x) * verticalFade;
  return color.rgb + lines.rgb;
}
`

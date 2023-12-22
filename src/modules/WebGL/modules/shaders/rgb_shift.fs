uniform sampler2D tDiffuse;
uniform float uTime;
uniform float shiftAmount;
uniform float speed;
uniform float waveFactor;
uniform bool enabled;

varying vec2 vUv;

#define PI 3.141592;

// #pragma glslify: cnoise2 = require(glsl-noise)
#pragma glslify: snoise2 = require(glsl-noise/simplex/2d);
// #pragma glslify: snoise3 = require(glsl-noise/simplex/3d)
// #pragma glslify: snoise4 = require(glsl-noise/simplex/4d)
// #pragma glslify: cnoise2 = require(glsl-noise/classic/2d)
// #pragma glslify: cnoise3 = require(glsl-noise/classic/3d)
// #pragma glslify: cnoise4 = require(glsl-noise/classic/4d)
// #pragma glslify: pnoise2 = require(glsl-noise/periodic/2d)
// #pragma glslify: pnoise3 = require(glsl-noise/periodic/3d)
// #pragma glslify: pnoise4 = require(glsl-noise/periodic/4d)
void main() {

  vec2 uv = vUv;

  if (enabled) {
    uv.x += sin((vUv.y * 20.0) + uTime) * waveFactor;
    uv.y += cos((vUv.x * 20.0) + uTime) * waveFactor * 0.5;
    float n = 0.5 + snoise2(vec2(uv + uTime * speed)) * 0.5;
    float angle = n * PI * 2.0;
    vec2 offset = n * shiftAmount * vec2(cos(angle), sin(angle));
    // offset = vec2(pow(offset.x, n), pow(offset.y, n));

    vec4 cr = texture2D(tDiffuse, uv + offset);
    vec4 cga = texture2D(tDiffuse, uv);
    vec4 cb = texture2D(tDiffuse, uv - offset);

    gl_FragColor = vec4(cr.r, cga.g, cb.b, cga.a);
  } else {
    gl_FragColor = texture2D(tDiffuse, uv);
  }
}

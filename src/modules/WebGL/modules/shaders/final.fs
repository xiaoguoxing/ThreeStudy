uniform sampler2D tDiffuse;
uniform vec2 uResolution;

#pragma glslify: fxaa = require(glsl-fxaa);

void main() {
  vec3 color = fxaa(tDiffuse, gl_FragCoord.xy, uResolution).rgb;
  gl_FragColor = vec4(color, 1.0);
}


#define HIGHP

uniform sampler2D u_texture;
uniform float u_time;

varying vec2 v_texCoords;

const float PI = 3.14159265359;

float s(float f, vec2 uv){
  return cos(sin(uv.x+sin(uv.y+u_time*0.15)+u_time*0.15+f));
}
void main(){
  vec4 c = texture2D(u_texture,v_texCoords);
  gl_FragColor = vec4(s(0.0,v_texCoords*100.0)*0.6,s(PI/2.0,v_texCoords*100.0)*0.5,s(2.*PI/3.,v_texCoords*100.0)*4.0, c.a);
}
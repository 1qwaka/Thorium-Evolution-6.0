
const rainbowBlue = extend(Shader, readString("shaders/default.vert"), readString("shaders/rainbowBlue.frag"), {
  apply() {
    this.setUniformf("u_time", Time.time);
  }
});
const rainbowGreen = extend(Shader, readString("shaders/default.vert"), readString("shaders/rainbowGreen.frag"), {
  apply() {
    this.setUniformf("u_time", Time.time);
  }
});
const _default = extend(Shader, readString("shaders/default.vert"), readString("shaders/default.frag"), {});


module.exports = {
  rainbowBlue: rainbowBlue,
  rainbowGreen: rainbowGreen,
  default: _default
};

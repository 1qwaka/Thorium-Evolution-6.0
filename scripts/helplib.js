// с телефона писать код не очень просто как бы
// хорошо, что уже не с телефона
// но эта штука все равно удобная
module.exports = {
  //mod name
  mn: "thorium-evolution-",

  floatc2: method => new Floatc2({ get: method }),

  //для ленивых
  itm: function (name) { return Vars.content.getByName(ContentType.item, this.mn + name) },
  liq: function (name) { return Vars.content.getByName(ContentType.liquid, this.mn + name) },
  block: function (name) { return Vars.content.getByName(ContentType.block, this.mn + name) },
  unit: function (name) { return Vars.content.getByName(ContentType.unit, this.mn + name) },

  // не всегда жс массив преобразовывается в жава массив автоматически
  javaArray(cls, jsArray){
    const javaArr = Packages.java.lang.reflect.Array.newInstance(cls,jsArray.length);
    for(var i in jsArray){
      javaArr[i] = jsArray[i]
    }
    return javaArr;
  }

};

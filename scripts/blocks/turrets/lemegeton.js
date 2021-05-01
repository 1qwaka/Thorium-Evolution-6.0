// длина на которую отходят первые движущиеся части (в игровых еденицах)
const d1 = (12 * Math.sqrt(2)) / 4;
// длина на которую отходят вторые движущиеся части
const d2 = (20 * Math.sqrt(2)) / 4;
const shaders = require("teshaders");
const buf = new FrameBuffer();
const h = require("helplib");
const outColor = Color.valueOf("B6F0EC");
const inColor = Color.valueOf("B6DDF0");

//instead of drawing 2 triangles i can just draw 1 rhombus
var rhombus = null;
Events.on(ClientLoadEvent, cons(e => {
  rhombus = Core.atlas.find(h.mn + "rhombus");
}))


function lineVectorCenter(x, y, vec) {
  Lines.line(x - vec.x / 2, y - vec.y / 2, x + vec.x / 2, y + vec.y / 2, false);
}


const lemegeton = extend(PowerTurret, "lemegeton", {
  _tr3: new Vec2(),
  _tr4: new Vec2(),
  _lightCenterRegion: null,
  _lightLeftRegion: null,
  _lightRightRegion: null,
  _centerRegion: null,
  _leftRegion1: null,
  _leftRegion2: null,
  _rightRegion1: null,
  _rightRegion2: null,
  _leftOutlineRegion1: null,
  _leftOutlineRegion2: null,
  _rightOutlineRegion1: null,
  _rightOutlineRegion2: null,
  _outlineCenterRegion: null,
  _fullRegion: null,
  _leftShadowRegion1: null,
  _leftShadowRegion2: null,
  _rightShadowRegion1: null,
  _rightShadowRegion2: null,
  _centerHeatRegion: null,
  _leftHeatRegion: null,
  _rightHeatRegion: null,
  load() {
    this.super$load();
    this.baseRegion = Core.atlas.find(h.mn + "block-10");
    this._lightCenterRegion = Core.atlas.find(this.name + "-light-center");
    this._lightLeftRegion = Core.atlas.find(this.name + "-light-left");
    this._lightRightRegion = Core.atlas.find(this.name + "-light-right");
    this._centerRegion = Core.atlas.find(this.name + "-center");
    this._leftRegion1 = Core.atlas.find(this.name + "-left-1");
    this._leftRegion2 = Core.atlas.find(this.name + "-left-2");
    this._rightRegion1 = Core.atlas.find(this.name + "-right-1");
    this._rightRegion2 = Core.atlas.find(this.name + "-right-2");
    this._leftOutlineRegion1 = Core.atlas.find(this.name + "-outline-left-1");
    this._leftOutlineRegion2 = Core.atlas.find(this.name + "-outline-left-2");
    this._rightOutlineRegion1 = Core.atlas.find(this.name + "-outline-right-1");
    this._rightOutlineRegion2 = Core.atlas.find(this.name + "-outline-right-2");
    this._outlineCenterRegion = Core.atlas.find(this.name + "-outline-center");
    this._fullRegion = Core.atlas.find(this.name + "-full");
    this._leftShadowRegion1 = Core.atlas.find(this.name + "-shadow-left-1");
    this._leftShadowRegion2 = Core.atlas.find(this.name + "-shadow-left-2");
    this._rightShadowRegion1 = Core.atlas.find(this.name + "-shadow-right-1");
    this._rightShadowRegion2 = Core.atlas.find(this.name + "-shadow-right-2");
    this._centerHeatRegion = Core.atlas.find(this.name + "-heat-center");
    this._leftHeatRegion = Core.atlas.find(this.name + "-heat-left");
    this._rightHeatRegion = Core.atlas.find(this.name + "-heat-right");
  },
  getRegions() {
    return [
      this._lightCenterRegion, //0
      this._lightLeftRegion, //1
      this._lightRightRegion, //2
      this._centerRegion, //3
      this._leftRegion1, //4
      this._leftRegion2, //5
      this._rightRegion1, //6
      this._rightRegion2, //7
      this._leftOutlineRegion1, //8
      this._leftOutlineRegion2, //9
      this._rightOutlineRegion1, //10
      this._rightOutlineRegion2, //11
      this._outlineCenterRegion, //12
      this._fullRegion, //13
      this._leftShadowRegion1, //14
      this._leftShadowRegion2, //15
      this._rightShadowRegion1, //16
      this._rightShadowRegion2, //17
      this._centerHeatRegion, //18
      this._leftHeatRegion, //19
      this._rightHeatRegion, //20
    ];
  },
  getTr() {
    return this.tr;
  },
  getTr2() {
    return this.tr2;
  },
  getTr3() {
    return this._tr3;
  },
  getTr4() {
    return this._tr4;
  },
  init() {
    this.super$init();
    this.health = 220 * this.size * this.size;
  }
});

lemegeton.buildType = prov(() => extend(PowerTurret.PowerTurretBuild, lemegeton, {
  _progress: 0,
  updateTile() {
    this.super$updateTile();
    if (this.power.status > 0.01 && (this.target != null || this.logicControlled() || this.isControlled())) {
      this._progress = Mathf.clamp(this._progress + 0.02 * this.power.status * Time.delta, 0, 1.6)
    } else {
      this._progress = Mathf.clamp(this._progress - 0.02 * Time.delta, 0, 1.6)
    }
  },
  drawOutline(tr, tr2, tr3, regs) {
    Draw.rect(regs[12], this.x + tr2.x, this.y + tr2.y, this.rotation - 90);
    Draw.rect(regs[8], this.x + tr.x * d1 + tr2.x, this.y + tr.y * d1 + tr2.y, this.rotation - 90);
    Draw.rect(regs[9], this.x + tr.x * d2 + tr2.x, this.y + tr.y * d2 + tr2.y, this.rotation - 90);
    Draw.rect(regs[10], this.x + tr3.x * d1 + tr2.x, this.y + tr3.y * d1 + tr2.y, this.rotation - 90);
    Draw.rect(regs[11], this.x + tr3.x * d2 + tr2.x, this.y + tr3.y * d2 + tr2.y, this.rotation - 90);
  },
  drawShadow(tr, tr2, tr3, regs) {
    const e = 5;
    Draw.color(Pal.shadow);
    if (this._progress >= 1) {
      Draw.rect(regs[13], this.x + tr2.x - e, this.y + tr2.y - e, this.rotation - 90);
    } else {
      const x = this.x - e;
      const y = this.y - e
      //outline
      try {
        // shadowBuffer.begin(Color.clear);
        Draw.rect(regs[12], x + tr2.x, y + tr2.y, this.rotation - 90);
        Draw.rect(regs[3], x + tr2.x, y + tr2.y, this.rotation - 90);
        Draw.rect(regs[14], x + tr.x * d1 + tr2.x, y + tr.y * d1 + tr2.y, this.rotation - 90);
        Draw.rect(regs[15], x + tr.x * d2 + tr2.x, y + tr.y * d2 + tr2.y, this.rotation - 90);
        Draw.rect(regs[16], x + tr3.x * d1 + tr2.x, y + tr3.y * d1 + tr2.y, this.rotation - 90);
        Draw.rect(regs[17], x + tr3.x * d2 + tr2.x, y + tr3.y * d2 + tr2.y, this.rotation - 90);
        // shadowBuffer.end();
        // Draw.rect(new TextureRegion(shadowBuffer.getTexture()),x,y);
        // shadowBuffer.blit(shaders.rainbow);
      } catch (e) {
        print(e)
        print(e.stack)
      }

    }

    Draw.color();
  },
  drawLights(tr, tr2, tr3, regs) {
    Draw.draw(Layer.turret, () => {
      // Draw.sort(false);
      //Core.graphics.clear(Color.black);
      // buf.resize(Core.graphics.getWidth(), Core.graphics.getHeight());
      // Draw.reset();
      // buf.begin(Color.clear);
      tr.trns(this.rotation + 135, Mathf.clamp(this._progress));
      tr2.trns(this.rotation, -this.recoil);
      tr3.trns(this.rotation - 135, Mathf.clamp(this._progress));

      Draw.shader(shaders.rainbowBlue);
      Draw.rect(regs[0], this.x + tr2.x, this.y + tr2.y, this.rotation - 90);
      Draw.rect(regs[1], this.x + tr.x * d2 + tr2.x, this.y + tr.y * d2 + tr2.y, this.rotation - 90);
      Draw.rect(regs[2], this.x + tr3.x * d2 + tr2.x, this.y + tr3.y * d2 + tr2.y, this.rotation - 90);
      Draw.shader();
      // buf.end();
      // buf.blit(shaders.rainbow);
      // Draw.sort(true);
      // Draw.flush();
    })
  },
  drawBody(tr, tr2, tr3, regs) {
    Draw.rect(regs[3], this.x + tr2.x, this.y + tr2.y, this.rotation - 90);
    Draw.rect(regs[4], this.x + tr.x * d1 + tr2.x, this.y + tr.y * d1 + tr2.y, this.rotation - 90);
    Draw.rect(regs[5], this.x + tr.x * d2 + tr2.x, this.y + tr.y * d2 + tr2.y, this.rotation - 90);
    Draw.rect(regs[6], this.x + tr3.x * d1 + tr2.x, this.y + tr3.y * d1 + tr2.y, this.rotation - 90);
    Draw.rect(regs[7], this.x + tr3.x * d2 + tr2.x, this.y + tr3.y * d2 + tr2.y, this.rotation - 90);
  },
  drawHeat(tr, tr2, tr3, regs) {
    Draw.rect(regs[3], this.x + tr2.x, this.y + tr2.y, this.rotation - 90);
    Draw.rect(regs[4], this.x + tr.x * d1 + tr2.x, this.y + tr.y * d1 + tr2.y, this.rotation - 90);
    Draw.rect(regs[5], this.x + tr.x * d2 + tr2.x, this.y + tr.y * d2 + tr2.y, this.rotation - 90);
    Draw.rect(regs[6], this.x + tr3.x * d1 + tr2.x, this.y + tr3.y * d1 + tr2.y, this.rotation - 90);
    Draw.rect(regs[7], this.x + tr3.x * d2 + tr2.x, this.y + tr3.y * d2 + tr2.y, this.rotation - 90);
  },
  drawNightLights() {
    Drawf.light(this.team, this, 40 + 20 * this._progress, outColor, 0.4 * Mathf.clamp(this._progress));
    /*
    const tr4 = this.block.getTr4();
    tr4.trns(this.rotation,60);
    const x = tr4.x+0.0;
    const y = tr4.y+0.0;
    tr4.trns(this.rotation,20,-30);
    Vars.renderer.lights.line(this.x+tr4.x,this.y+tr4.y,this.x+tr4.x+x,this.y+tr4.y+y,5.0,Color.white,0.5);
    tr4.trns(this.rotation,-20,-30);
    Vars.renderer.lights.line(this.x+tr4.x,this.y+tr4.y,this.x+tr4.x+x,this.y+tr4.y+y,5.0,Color.white,0.5);
    tr4.trns(this.rotation,30,-20);
    Vars.renderer.lights.line(this.x+tr4.x,this.y+tr4.y,this.x+tr4.x+x/2,this.y+tr4.y+y/2,5.0,Color.white,0.5);
    tr4.trns(this.rotation,-30,-20);
    Vars.renderer.lights.line(this.x+tr4.x,this.y+tr4.y,this.x+tr4.x+x/2,this.y+tr4.y+y/2,5.0,Color.white,0.5);
    */
  },
  drawTurretHeat(tr, tr2, tr3, regs) {
    Draw.color(this.block.heatColor, this.heat);
    Draw.blend(Blending.additive);

    Draw.rect(regs[18], this.x + tr2.x, this.y + tr2.y, this.rotation - 90);
    Draw.rect(regs[19], this.x + tr.x * d1 + tr2.x, this.y + tr.y * d1 + tr2.y, this.rotation - 90);
    Draw.rect(regs[20], this.x + tr3.x * d1 + tr2.x, this.y + tr3.y * d1 + tr2.y, this.rotation - 90);

    Draw.blend();
  },
  draw() {
    if (this._progress <= 0) {
      this.super$draw();
      return;
    }

    Draw.rect(this.block.baseRegion, this.x, this.y);

    const tr = this.block.getTr();
    const tr2 = this.block.getTr2();
    const tr3 = this.block.getTr3();
    const p = Mathf.clamp(this._progress);
    const regs = this.block.getRegions();

    // tr.setZero();
    // tr2.setZero();
    // tr3.setZero();

    // вращаем 2 вектора единичной длины, и один вектор для отдачи
    //left
    tr.trns(this.rotation + 135, p);
    //center, recoil
    tr2.trns(this.rotation, -this.recoil);
    //right
    tr3.trns(this.rotation - 135, p);

    Draw.z(Layer.turret);

    // можно оптимизировать до 4 методов, не вызывая drawOutline и рисовать вмесе с обводкой спрайты,
    // это так же значительно сократит количество спрайтов
    this.drawShadow(tr, tr2, tr3, regs);
    this.drawOutline(tr, tr2, tr3, regs);
    this.drawLights(tr, tr2, tr3, regs);
    this.drawBody(tr, tr2, tr3, regs);
    this.drawTurretHeat(tr, tr2, tr3, regs);


    if (Vars.renderer.lights.enabled()) {
      this.drawNightLights();
    }


  },
  // shoot(type){
  //   this.super$shoot(type);

  // },
  baseReloadSpeed() {
    return this.efficiency() * Mathf.clamp(this._progress);
  },
  write(w) {
    w.f(this._progress);
  },
  read(r) {
    this._progress = r.f();
  }
}));

const lemegetonTrail = new Effect(18, cons(e => {
  Lines.stroke(4.0 * e.fout());
  Lines.lineAngle(e.x, e.y, e.rotation - 180, 7.0 * e.fout())
  Lines.stroke(1.0);
}));
const lemegetonTrail2 = new Effect(18, cons(e => {
  Lines.stroke(4.0 * e.fout());
  Lines.lineAngle(e.x, e.y, e.rotation - 180, 6.0)
  Lines.stroke(1.0);
}));
const lemegetonTrail3 = new Effect(15, cons(e => {
  Draw.color(outColor);
  Draw.rect(rhombus, e.x, e.y, 4.0 + 2.0 * e.fin(), 5.0 * e.fout(), e.rotation);
}));
lemegeton.shootType = extend(BasicBulletType, {
  damage: 400,
  lifetime: 48,
  speed: 7.0,
  trailEffect: lemegetonTrail,
  trailEffect2: lemegetonTrail2,
  trailEffect3: lemegetonTrail3,
  lightRadius: 26.0,
  lightOpacity: 0.4,
  lightColor: Color.white,
  hitShake: 2.0,
  despawnEffect: Fx.none,
  fragBullets: 6,
  fragVelocityMin: 0.5,
  fragVelocityMax: 2.0,
  homingRange: 110.0,
  homingPower: 0.0055,
  // homingDelay: 10,
  draw(b) {

    Tmp.v1.trns(b.rotation(), 20.0);

    Lines.stroke(10.5);
    Draw.color(outColor);
    lineVectorCenter(b.x, b.y, Tmp.v1)
    Drawf.tri(b.x + Tmp.v1.x / 2, b.y + Tmp.v1.y / 2, 10.5 + 1.5, 4, b.rotation());
    Drawf.tri(b.x - Tmp.v1.x / 2, b.y - Tmp.v1.y / 2, 10.5 + 1.5, 4, b.rotation() - 180.0);

    Lines.stroke(5.0);
    Draw.color(inColor);
    lineVectorCenter(b.x, b.y, Tmp.v1);
    Drawf.tri(b.x + Tmp.v1.x / 2, b.y + Tmp.v1.y / 2, 5.0 + 1.0, 2.5, b.rotation());
    Drawf.tri(b.x - Tmp.v1.x / 2, b.y - Tmp.v1.y / 2, 5.0 + 1.0, 2.5, b.rotation() - 180.0);

    Lines.stroke(1.0);

    this.drawLight(b);
  },
  update(b) {
    this.super$update(b);
    this.trailEffect.at(b.x + Mathf.range(5), b.y + Mathf.range(5), b.rotation());
    if (Mathf.chance(0.35)) {
      this.trailEffect2.at(b.x + Mathf.range(5), b.y + Mathf.range(5), b.rotation());
    }
    if (Mathf.chance(0.25)) {
      this.trailEffect3.at(b.x + Mathf.range(5), b.y + Mathf.range(5), b.rotation());
    }
  }
});
const lemegetonShot = new Effect(14, cons(e => {
  Draw.color(outColor);
  Draw.rect(rhombus, e.x, e.y, e.fout() * 22, 20 + 8 * e.fslope(), e.rotation);
  e.scaled(7, cons(s => {
    Draw.color(inColor);
    Draw.rect(rhombus, s.x, s.y, s.fout() * 12 + 4 * s.fslope(), 35 + 10 * s.fslope(), e.rotation)
  }));
}));
lemegeton.shootEffect = lemegetonShot;
const lemegetonHit = new Effect(20, cons(e => {
  Angles.randLenVectors(e.id, e.finpow(), 12, 42, new Angles.ParticleConsumer({
    accept(x, y, fin, fout) {
      Draw.color(Color.white);
      Draw.rect(rhombus, e.x + x, e.y + y, 22 * fout, 22 * fout);
      // Draw.rect(rhombus,e.x+x,e.y+y,5*fout,5+fin*2);
    }
  }))
}));
lemegeton.shootType.hitEffect = lemegetonHit;
const lemegetonFragHit = new Effect(11, cons(e => {
  Draw.color(Color.white);
  Lines.stroke(1.0 + 3.5 * e.fout());
  Lines.square(e.x, e.y, 7 * e.fin(), 45);
}));
const lemegetonFrag = extend(BasicBulletType, {
  pierce: true,
  pierceCap: 4,
  drag: 0.1,
  speed: 3.9,
  damage: 50,
  lifetime: 18,
  hitEffect: lemegetonFragHit,
  despawnEffect: Fx.none,
  pierceBuilding: true,
  hit(b) {
    //this.super$hit(b);
    //this.hitEffect.at(b.x, b.y, b.rotation());
    if (Mathf.chance(0.3)) {
      this.hitEffect.at(b.x, b.y);
      b.remove();
    }
  },
  draw(b) {
    Draw.color(Color.white);
    Draw.rect(rhombus, b.x, b.y, 16 * b.fout(), 16 * b.fout());
  }
});
lemegeton.shootType.fragBullet = lemegetonFrag;

// var recipes = []
// // первый рецепт
// recipes[0] = []
// // первую позцицию в первом рецепте занимает предмет
// recipes[0][0] = {
//   liquid: Items.copper,
//   amount: 2
// }
// // вторую позцицию в первом рецепте занимает жидкость
// recipes[0][1] = {
//   item: Liquids.water,
//   amount: 10
// }
// // третью позицию в первом рецепте занимает просто число, количество времени для крафта
// recipes[0][2] = 60
// // четвертую позицию в первом рецепте занимает производимый предмет
// recipes[0][3] = {
//   item: Items.surgealloy,
//   amount: 1
// }

// function updateTile(){

//   for (var i = 0; i < 1; i++) {

//     if (this.items.has(recipes[i][0].item, recipes[i][0].amount) &&
//       this.liquids.get(recipes[i][1].liquid) >= recipes[i][1].amount &&
//       this.timer.get(recipes[i][2] / this.power.status) &&
//       this.items.get(recipes[i][3].item) < this.block.itemCapacity) {

//       this.items.remove(recipes[i][0].item, recipes[i][0].amount);
//       this.items.add(recipes[i][3].item);
//       this.dump(item1);
//       this.dump(item1);

//     }

//   }

// }
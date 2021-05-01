//const teshaders = require ("teshaders");
var vec = new Vec2();
const draw = require ("tedraw");
var shieldRadius = 32;

const plazorDespawn = newEffect(16,e=>{
  draw.drawcol("#f44071");
  Lines.stroke(e.fout()*3);
  Lines.square(e.x,e.y,20*e.fin(),45);
});

const plazorHit = newEffect(16,e=>{
  draw.drawcol("#f44071");
  Lines.stroke(e.fout()*5);
  Lines.circle(e.x,e.y,e.fin()*30);
});

const plazorMissileHit = newEffect(16,e=>{
  draw.drawcol("#f44071");
  Lines.stroke(e.fout());
  Lines.circle(e.x,e.y,20*e.fin());
  Angles.randLenVectors(e.id,6,24*e.fin(),floatc2((x,y)=>{
    Lines.lineAngle(e.x+x,e.y+y,Mathf.angle(x,y),3);
  }));
});

const plazorMissileDespawn = newEffect(16,e=>{
  draw.drawcol("#f44071");
  Lines.stroke(e.fout());
  Lines.circle(e.x,e.y,8*e.fin());
});

const plazorMissile = extend(MissileBulletType,{
  /*
  draw(b){
    Draw.shader(teshaders.plazorBullet.shader);
    Draw.rect(this.backRegion, b.x, b.y, 9, 12, b.rot() - 90);
    Draw.rect(this.frontRegion, b.x, b.y, 9, 12, b.rot() - 90);
    Draw.shader();
  },
  load (){
    this.super$load();
    this.backRegion = Core.atlas.find(mn+"missile-back-darker");
  }
  */
});
plazorMissile.speed = 3;
plazorMissile.lifetime = 50;
plazorMissile.damage = 50;
plazorMissile.splashDamage = 100;
plazorMissile.splashDamageRadius = 24;
plazorMissile.weaveScale = 4;
plazorMissile.weaveMag = 10;
plazorMissile.bulletHeight = 12;
plazorMissile.bulletWidth = 9;
plazorMissile.hitEffect = plazorMissileHit;
plazorMissile.despawnEffect = plazorMissileDespawn;
plazorMissile.frontColor = Color.valueOf("f25c85");
plazorMissile.backColor = Color.valueOf("#ea4a76");
plazorMissile.trailColor = Color.valueOf("#f88989");


const plazorBullet = extend(BasicBulletType,{
  draw(b){
    draw.drawcol("#f25c85");
    //Draw.shader(teshaders.plazorBullet.shader)
    Draw.rect(mn+"nox-alpha-bullet",b.x,b.y,6+6*b.fout(),6,b.rot());
    //Draw.shader();
  },
  hit(b){
    Damage.damage(b.getTeam(),b.x,b.y,30,600);
    Effects.effect(plazorHit,b);
  },
  despawned(b){
    for(var i = 0;i<3;i++){
      Bullet.create(plazorMissile,b.getOwner(),b.x,b.y,b.rot()-15+15*i);
    }
    Effects.shake(2,4,b.x,b.y);
    Effects.effect(plazorDespawn,b);
  },
  range(){
    return 155;
  }
});
plazorBullet.speed = 4;
plazorBullet.drag = 0.05;
plazorBullet.lifetime = 26;

const plazorEquip = extendContent(Weapon,"plazor-equip",{
  load(){
    this.region = Core.atlas.find(mn+this.name);
  }
});
plazorEquip.bullet = plazorBullet;
plazorEquip.width = 16;
plazorEquip.length = -6;
plazorEquip.reload = 120;
plazorEquip.shots = 3;
plazorEquip.spacing = 8;
plazorEquip.shake = 2;
plazorEquip.shotDelay = 4;
plazorEquip.alternate = true;


const plazor = extendContent (UnitType,"plazor",{
  displayInfo(table){
    ContentDisplay.displayUnit(table,this);
    table.add(Core.bundle.format("unit.shield-damage-reduction", "50%"));
  }
});
plazor.weapon = plazorEquip;

plazor.create(prov(()=>extend(HoverUnit,{
  _angles: [0,0],
  _t: new Interval(1),
  _shield: false,
  _a: 0,
  drawWeapons(){
    for(var i = -1;i<=1;i+=2){
      var w = this.getWeapon();
      vec.set(w.width*i,-w.getRecoil(this, i > 0) + this.type.weaponOffsetY).rotate(this.rotation-90);
      if(this.target!=null){
        this._angles[(i+1)/2] = Mathf.slerpDelta(this._angles[(i+1)/2],Angles.angle(this.x+vec.x,this.y+vec.y,this.target.getX(),this.target.getY())-90,0.1);
      }
      Draw.rect(w.region,this.x+vec.x,this.y+vec.y,w.region.getWidth()*i/4,w.region.getHeight()/4,this._angles[(i+1)/2]);
    }
  },
  getPowerCellRegion (){
    return Core.atlas.find(this.type.name+"-cell");
  },
  update (){
    this.super$update();
    if(this._t.get(0,240)){
      this._shield = !this._shield;
    }
    //print(this.getPowerCellRegion.toString());
  },
  calculateDamage(a){
    var s = this._shield ? 2 : 1;
    return this.super$calculateDamage(a)/s;
  },
  drawStats(){
    this.super$drawStats();
    var a = this._shield ? 0.015 : -0.015;
    this._a = Mathf.clamp(this._a+a,0,0.4);
    Draw.color(Color.valueOf("f25c85"),this._a);
    Fill.circle(this.x,this.y,shieldRadius);
    Lines.circle(this.x,this.y,shieldRadius);
    Draw.alpha(1);
    Draw.color();
  },
  hitbox(rect){
    rect.setSize(this.type.hitsize+this._shield*8).setCenter(this.x, this.y);
  }
})));
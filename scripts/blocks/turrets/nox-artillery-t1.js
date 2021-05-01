
var innerRadius = 240;
var yellow = Color.valueOf("F5EB78FF");
var lightYellow = Color.valueOf("FFFAC2FF");
var h = require("helplib");

const artT1shoot = new Effect(14,cons(e=>{
  Draw.color(yellow);
  Drawf.tri(e.x,e.y,2+3*e.fslope(),12*e.fslope(),e.rotation);
  Drawf.tri(e.x,e.y,2+3*e.fslope(),12*e.fslope(),e.rotation+180);
  Drawf.tri(e.x,e.y,1+3*e.fslope(),25+10*e.fslope(),e.rotation+90);
  Drawf.tri(e.x,e.y,1+3*e.fslope(),25+10*e.fslope(),e.rotation-90);
  Draw.rect("circle-shadow",e.x,e.y,12*e.fslope(),12*e.fslope());
  Draw.color(lightYellow);
  Drawf.tri(e.x,e.y,2*e.fslope(),7*e.fslope(),e.rotation+180);
  Drawf.tri(e.x,e.y,2*e.fslope(),7*e.fslope(),e.rotation);
  Drawf.tri(e.x,e.y,2*e.fslope(),30+13*e.fslope(),e.rotation+90);
  Drawf.tri(e.x,e.y,2*e.fslope(),30+13*e.fslope(),e.rotation-90);
}));

const artT1Hit = new Effect(20,cons(e=>{
  Draw.color(yellow);
  for(var i=0;i<5;i++){
    Drawf.tri(e.x,e.y,0.3+2*e.fslope(),23+4*e.fslope(),i*90);
  }
  e.scaled(12,cons(s=>{
    Lines.stroke(s.fout());
    Lines.circle(s.x,s.y,s.fin()*30);
  }));
}));

const artT1HitSmall = new Effect(18,e=>{
  Draw.color(yellow);
  for(var i=0;i<4;i++){
    Drawf.tri(e.x,e.y,e.fslope(),7+3*e.fslope(),i*90);
  }
  e.scaled(10,cons(s=>{
    Lines.stroke(s.fout());
    Lines.circle(s.x,s.y,s.fin()*12);
  }));
});

const artT1BulletFrag = extend(BasicBulletType,{
  draw(b){
    Draw.color(yellow);
    Drawf.tri(b.x,b.y,6*b.fout(),6*b.fout(),b.id%6*60);
  }
});
artT1BulletFrag.speed = 0;
artT1BulletFrag.damage = 80;
artT1BulletFrag.lifetime = 32;
artT1BulletFrag.hitEffect = artT1HitSmall;
artT1BulletFrag.smokeEffect = Fx.none;
artT1BulletFrag.shootEffect = Fx.none;
artT1BulletFrag.despawnEffect = Fx.none;


const artT1Bullet = extend(BasicBulletType,{
  draw(b){
    var r = b.rotation();
    Draw.color(yellow);
    Drawf.tri(b.x,b.y,7,10,r);
    Drawf.tri(b.x,b.y,7,18,r-180);
    Draw.color(lightYellow);
    Drawf.tri(b.x,b.y,5,8.5,r-120);
    Drawf.tri(b.x,b.y,5,8.5,r+120);
    Drawf.tri(b.x,b.y,4,13,r);
    Drawf.tri(b.x,b.y,4,20,r-180);
  },
  despawned(b){
    Effect.shake(4,4,b.x,b.y);
    for(var i=0;i<6;i++){
      artT1BulletFrag.create(b.owner,b.x+Mathf.range(20),b.y+Mathf.range(20),0);
    }
    this.hitEffect.at(b);
  },
  hit(b){
    //this.hit(b);
  }
});
artT1Bullet.speed = 20;
artT1Bullet.damage = 130;
artT1Bullet.splashDamage = 130;
artT1Bullet.splashDamageRadius = 24;
artT1Bullet.lifetime = 55;
artT1Bullet.hitEffect = artT1Hit;
artT1Bullet.smokeEffect = Fx.none;
artT1Bullet.shootEffect = Fx.none;




const noxArtT1 = extend(PowerTurret,"nox-artillery-t1",{
  load(){
    this.super$load();
    this.baseRegion = Core.atlas.find(h.mn+"block-5");
  },
  drawPlace(x, y, rotation, valid){
    var s = this.range-innerRadius;
    Lines.stroke(s);
    Draw.color(Pal.accent,0.3);
    Lines.circle(x*8,y*8,innerRadius+s/2);
    Drawf.dashCircle(x * 8, y * 8, this.range, Pal.placing);
    Drawf.dashCircle(x * 8, y * 8, innerRadius, Pal.placing);
  }
});
noxArtT1.buildType = () => extend(PowerTurret.PowerTurretBuild,noxArtT1,{
  findTarget(){
    this.target = Units.bestTarget(this.team, this.x, this.y, this.block.range, boolf(u=>u.isValid()&&!Mathf.within(u.x,u.y,this.x,this.y,innerRadius)),boolf(t=>!Mathf.within(this.x,this.y,t.x,t.y,innerRadius)), this.block.unitSort);
  },
  drawSelect(){
    var s = this.block.range-innerRadius;
    Lines.stroke(s);
    Draw.color(Pal.accent,0.3);
    Lines.circle(this.x,this.y,innerRadius+s/2);
    Drawf.dashCircle(this.x,this.y, this.block.range, this.team.color);
    Drawf.dashCircle(this.x,this.y, innerRadius, this.team.color);
  }
});
noxArtT1.shootType = artT1Bullet;
noxArtT1.shootEffect = artT1shoot;

var h = require ("helplib");

var colors = [
  Color.valueOf("EB6868FF"),
  Color.valueOf("EFB0B0FF"),
  Color.valueOf("EDDADAFF")
];


const dischargeChargeBegin = new Effect(50,cons(e=>{
  Draw.color(colors[0]);
  Fill.circle(e.x,e.y,6.5*e.fin());
  Draw.color(colors[1]);
  Fill.circle(e.x,e.y,1+3.5*e.fin());
  Draw.color(colors[2]);
  Fill.circle(e.x,e.y,1.5+e.fin()*1.5);
}));

const dischargeCharge = new Effect(18,cons(e=>{
  Draw.color(colors[0],colors[2],e.fin());
  Angles.randLenVectors(e.id,3,5+30*e.fout(),e.rotation,120,h.floatc2((x,y)=>{
    Draw.rect("circle",e.x+x,e.y+y,7*e.fout()+1,0.5+3*e.fin(),Mathf.angle(x,y));
  }));
}));

const dischargeHit = new Effect(28,cons(e=>{
  Draw.color(colors[0]);
  Lines.stroke(2+e.fout());
  for(var i = 0; i<3;i++){
    Lines.swirl(e.x,e.y,22,e.fout()*1/3,120*i+60*e.fin()+(e.id%6)*60);
  }
  for(i = 1; i<3;i++){
    Lines.swirl(e.x,e.y,12,e.fout()*0.5,180*1+90*e.fin()+(e.id%6)*60);
  }
}));

const dischargeShot = new Effect(18,cons(e=>{
  Draw.color(colors[0]);
  Draw.rect("circle",e.x,e.y,e.fout(),8+2*e.fout(),e.rotation);
}));

const dischargeSphere = extend(BasicBulletType,{
  // hit(b){
    
  // },
  lightningAfter: function(team,x,y){
    Time.run(Mathf.random(60),run(()=>{
      var angle = Mathf.random(360);
      Tmp.v1.trns(angle,Mathf.random(10,100));
      Lightning.create(team,Color.valueOf("#e06262"),Mathf.random(50,80),x+Tmp.v1.x,y+Tmp.v1.y,angle, Mathf.random(3,8));
      if(Mathf.chance(0.4)) Sounds.spark.at(x+Tmp.v1.x,y+Tmp.v1.y);
    }));
  },
  hit(b){
    Damage.damage(b.team,b.x,b.y,32,150);
    this.hitEffect.at(b);
    Effect.shake(8,16,b);
    for(var i = 0; i < 14; i++){
      Lightning.create(b.team,Color.valueOf("#e06262"),Mathf.random(100,150),b.x,b.y,Mathf.random(360), Mathf.random(5,25));
    }
    for(i = 0; i < 10; i++){
      this.lightningAfter(b.team,b.x,b.y);
    }
    for(i = 0; i < Mathf.random(2,5); i++){
      Sounds.spark.at(b.x,b.y);
    }
  },
  draw(b){
    Draw.color(colors[0]);
    Fill.circle(b.x,b.y,6.5);
    Draw.color(colors[1]);
    Fill.circle(b.x,b.y,4.5+Mathf.range(0.5));
    Draw.color(colors[2]);
    Fill.circle(b.x,b.y,3);
  }
});
dischargeSphere.lifetime = 50;
dischargeSphere.damage = 300;
dischargeSphere.splashDamage = 150;
dischargeSphere.splashDamageRadius = 32;
dischargeSphere.speed = 6;
dischargeSphere.hitEffect = dischargeHit;
dischargeSphere.knockback = 35;
//dischargeSphere

const tedischarge = extend(PowerTurret,"tedischarge",{
  load(){
    this.super$load();
    this.baseRegion = Core.atlas.find(h.mn+"block-6");
  },
  setStats(){
    this.super$setStats();
    this.stats.remove(Stat.damage);
    this.stats.add(Stat.damage,"~2800","");
  }
});/*
tedischarge.buildType = prov(()=>extend(PowerTurret.PowerTurretBuild,tedischarge,{
  shoot(type){
    this.super$shoot(type);
  }
}));*/
tedischarge.shootType = dischargeSphere;
tedischarge.chargeBeginEffect = dischargeChargeBegin;
tedischarge.chargeEffect = dischargeCharge;

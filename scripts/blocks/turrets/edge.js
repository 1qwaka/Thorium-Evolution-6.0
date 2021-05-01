var v = new Vec2();
var v2 = new Vec2();

const edgeColor = Color.valueOf("#8774e9");

const edgeHit2 = new Effect(18,cons(e=>{
  Draw.color(edgeColor);
  Draw.alpha(e.fout());
  Draw.blend(Blending.additive);
  Draw.rect("thorium-evolution-razor",e.x,e.y,19,19,e.rotation);
  Draw.blend();
}));
const edgeTrail = new Effect(18,cons(e=>{
  Draw.color(edgeColor);
  Draw.alpha(e.fout());
  Draw.rect("thorium-evolution-razor",e.x,e.y,14+5*e.fout(),14+5*e.fout(),e.rotation);
}));
const edgeDespawn = new Effect(18,cons(e=>{
  Draw.color(edgeColor);
  Draw.alpha(e.fout());
  Draw.rect("thorium-evolution-razor",e.x,e.y,14+5*e.fout(),19*e.fout(),e.rotation-90);
}));
const edgeHit = new Effect(18,cons(e=>{
  v.x = 0; v.y = 0;
  Draw.color(edgeColor);
  var f = new Floatc2({get: function (x,y){
    Fill.circle(e.x+x+v.x,e.y+y+v.y,2*e.fout());
  }});
  Angles.randLenVectors(e.id,3,10*e.fin(),e.rotation,30,f);
  v.trns(e.rotation+90,4);
  Angles.randLenVectors(e.id+851,3,10*e.fin(),e.rotation,30,f);
  v.trns(e.rotation-90,4);
  Angles.randLenVectors(e.id+13,3,10*e.fin(),e.rotation,30,f);
}));
const edgeSmoke = new Effect(18,cons(e=>{
  v.x = 0; v.y = 0;
  Draw.color(edgeColor);
  var f = new Floatc2({get: function (x,y){
    Fill.square(e.x+v.x+x,e.y+v.y+y,2.5*e.fout(),45+e.rotation);
  }});
  Angles.randLenVectors(e.id,3,15*e.fin(),e.rotation,30,f);
  v.trns(e.rotation+90,6);
  Angles.randLenVectors(e.id+739,3,15*e.fin(),e.rotation,30,f);
  v.trns(e.rotation-90,6);
  Angles.randLenVectors(e.id+132,3,15*e.fin(),e.rotation,30,f);
}));

const edgeFrag = extend(BasicBulletType,{
  update(b){
    if(b.timer.get(3)) edgeTrail.at(b.x,b.y,b.rotation()-90);
  },
  draw(b){
    Draw.color(edgeColor);
    Draw.rect("thorium-evolution-razor",b.x,b.y,14+5*b.fout(),14+5*b.fout(),b.rotation()-90);
  }
});
edgeFrag.pierceCap = 3;
edgeFrag.pierce = true;
edgeFrag.pierceBuilding = true;
edgeFrag.hitSize = 5.5;
edgeFrag.lifetime = 53;
edgeFrag.speed = 3.8;
edgeFrag.despawnEffect = edgeDespawn;
edgeFrag.hitEffect = edgeHit;
edgeFrag.smokeEffect = edgeSmoke;
edgeFrag.damage = 80;

const edgeBullet = extend(BasicBulletType,{
  update(b){
    if(b.timer.get(3)) edgeTrail.at(b.x,b.y,b.rotation()-90);
  },
  hitEntity(b,other,health){
    b.vel.scl(0.8);
    for(var i=-1;i<2;i++){
      edgeFrag.create(b.owner, b.team,b.x,b.y,b.rotation()+30*i+Mathf.range(10),-1,Mathf.random(0.4,0.6),Mathf.random(0.6,0.8),null);
      edgeHit2.at(b.x,b.y,b.rotation());
    }
    edgeHit.at(b.x,b.y,b.rotation());
  },
  hitTile(b,tile,health){
    b.vel.scl(0.8);
    for(var i=-1;i<2;i++){
      edgeFrag.create(b.owner, b.team,b.x,b.y,b.rotation()+30*i+Mathf.range(10),-1,Mathf.random(0.4,0.6),Mathf.random(0.6,0.8),null);
      edgeHit2.at(b.x,b.y,b.rotation()-90);
    }
    edgeHit.at(b.x,b.y,b.rotation());
  },
  draw(b){
    Draw.color(edgeColor);
    Draw.rect("thorium-evolution-razor",b.x,b.y,14+5*b.fout(),14+5*b.fout(),b.rotation()-90);
  }
});
edgeBullet.pierceCap = 3;
edgeBullet.pierce = true;
edgeBullet.pierceBuilding = true;
edgeBullet.hitSize = 5.5;
edgeBullet.lifetime = 53;
edgeBullet.speed = 3.8;
edgeBullet.despawnEffect = edgeDespawn;
edgeBullet.hitEffect = edgeHit;
edgeBullet.smokeEffect = edgeSmoke;
edgeBullet.damage = 80;



const edge = extend(PowerTurret,"edge",{});
edge.shootType = edgeBullet;
edge.heatColor = edgeColor;
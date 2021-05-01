const titaniumTrail = new Effect(20,cons(e=>{
  Draw.color(Items.titanium.color);
  Fill.square(e.x,e.y,2*e.fout(),e.rotation+45);
}));

const titaniumFrag = new ShrapnelBulletType();
titaniumFrag.length = 50;
titaniumFrag.damage = 150;
titaniumFrag.lifetime = 10;

const seaRockTitanium = extend(BasicBulletType,{
  update (b){
    if(b.timer.get(2))titaniumTrail.at(b.x,b.y,b.rotation());
  },
  despawned(b){
    this.super$despawned(b);
    Effect.shake(6,6,b);
  }
});
seaRockTitanium.scaleVelocity = true;
seaRockTitanium.hitEffect = Fx.none;
seaRockTitanium.despawnEffect = Fx.none;
seaRockTitanium.lifetime = 24;
seaRockTitanium.speed = 6;
seaRockTitanium.damage = 50;
seaRockTitanium.fragCone = 2;
seaRockTitanium.fragBullets = 1;
seaRockTitanium.fragBullet = titaniumFrag;
seaRockTitanium.frontColor = Items.titanium.color;
seaRockTitanium.backColor = Color.valueOf("6C6CC3FF");

const seaRock = extend(ItemTurret,"sea-rock",{
 load(){
    this.super$load();
    this.baseRegion = Core.atlas.find("thorium-evolution-block-5");
  }
});
seaRock.ammo(Items.titanium,seaRockTitanium);

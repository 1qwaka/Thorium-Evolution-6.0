
const missileSmall = function(speed,damage,radius,size,frontcol,backcol){
  
  var trailEffect = new Effect(28,cons(e=>{
    Draw.color(e.color);
    Fill.circle(e.x, e.y, e.rotation * e.fout());
  }));
  
  var hitEffect = new Effect(11,cons(e=>{
    Draw.color(e.color);
    Lines.stroke(e.fout());
    Lines.circle(e.x, e.y, e.rotation * e.fin());
  }));
  
  var missile = extend(MissileBulletType,{
    despawned(b){
      if(!b.absorbed){
        Effect.shake(this.hitShake, this.hitShake, b);
        Damage.damage(b.team, b.x, b.y, this.splashDamageRadius, this.splashDamage * b.damageMultiplier());
      } 
      this.fragBullet.create(b.owner,b.x+7,b.y,0);
      this.fragBullet.create(b.owner,b.x,b.y+7,90);
      this.fragBullet.create(b.owner,b.x-7,b.y,180);
      this.fragBullet.create(b.owner,b.x,b.y-7,270);
    },
    hit(b){
      this.hitEffect.at(b.x,b.y,this.splashDamageRadius,this.frontColor);
      this.hitSound.at(b);
    },
    update(b){
      if(b.timer.get(2)) this.trailEffect.at(b.x, b.y, this.trailParam, this.trailColor);
    }
  });
  
  missile.lifetime = 216/speed;
  missile.speed = speed;
  missile.damage = damage*0.5;
  missile.splashDamage = damage;
  missile.splashDamageRadius = radius;
  missile.frontColor = Color.valueOf(frontcol);
  missile.backColor = Color.valueOf(backcol);
  missile.homingPower = 0;
  missile.trailColor = Color.valueOf(frontcol);
  missile.hitColor = Color.valueOf(backcol);
  missile.trailParam = 2.9;
  missile.height = size;
  missile.width = size*0.8;
  missile.trailEffect = trailEffect;
  missile.hitShake = 2;
  missile.hitEffect = hitEffect;
  
  missile.fragBullet = extend(MissileBulletType,{
    update(b){
      if(b.timer.get(4)) this.trailEffect.at(b.x, b.y, this.trailParam, this.trailColor);
    }
  });
  missile.fragBullet.lifetime = 80/(speed*0.8);
  missile.fragBullet.speed = speed*0.8;
  missile.fragBullet.damage = damage*0.5;
  missile.fragBullet.splashDamage = damage*0.5;
  missile.fragBullet.splashDamageRadius = radius*0.5;
  missile.fragBullet.frontColor = Color.valueOf(frontcol);
  missile.fragBullet.backColor = Color.valueOf(backcol);
  missile.fragBullet.homingPower = 0;
  missile.fragBullet.trailColor = Color.valueOf(frontcol);
  missile.fragBullet.hitColor = Color.valueOf(backcol);
  missile.fragBullet.trailParam = 1.5;
  missile.fragBullet.height = size*0.9;
  missile.fragBullet.width = size*0.9*0.8;
  missile.fragBullet.trailEffect = trailEffect;
  
  return missile;
};

const missileThorium = missileSmall(4.5,30,32,11,"F89CC2","C686BA");
const missileBlast = missileSmall(5,48,32,11,"D59180FF","D27F6AFF");

const missileLauncherSmall = extend (ItemTurret,"missile-launcher-small",{
  
});
missileLauncherSmall.ammo(Items.thorium,missileThorium,Items.blastCompound,missileBlast);
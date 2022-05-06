
var h = require("helplib");

const thoriumBreakerBullet = function(damage, speed, lifetime, size, frontColor, backColor, laserLength, laserDamage, lightningChance, lightningLength, shake, width){
  
  const bullet = extend(BasicBulletType,{
    update(b){
      if(b.timer.get(5)) this.trailEffect.at(b.x,b.y,b.rotation(),this.frontColor,this.height);
    },
    hit(b){
      this.fragBullet.create(b.owner,b.x,b.y,0);
    },
    despawned(b){
      this.fragBullet.create(b.owner,b.x,b.y,0);
    },
    draw(b){
      Draw.color(this.backColor);
      Fill.square(b.x,b.y,this.height*(1+0.6*b.fin()),b.rotation()+45+Time.time*3);
      Draw.color(this.frontColor);
      Fill.square(b.x,b.y,this.height*(0.6+0.6*b.fin()),b.rotation()+45);
    }
  });
  bullet.speed = speed;
  bullet.lifetime = lifetime;
  bullet.damage = damage;
  bullet.frontColor = frontColor;
  bullet.backColor = backColor;
  bullet.height = size;
  bullet.trailEffect = new Effect(12,cons(e=>{
    Draw.color(e.color);
    Fill.square(e.x,e.y,e.data*e.fout(),45+e.rotation);
  }));
  
  bullet.fragBullet = extend(BasicBulletType,{
    update(b){
      if(b.timer.get(5)){
        if(Mathf.chance(this.trailChance)){
          Lightning.create(b,this.frontColor,Mathf.random(this.damage*1.3,this.damage*1.8),b.x,b.y,Mathf.random(360), Mathf.random(this.lightningLength*0.6,this.lightningLength*1.4));
        }
        Effect.shake(this.hitShake,this.hitShake,b.x,b.y);
        this.trailEffect.at(b.x,b.y,this.height*0.6,this.backColor,this.width*0.25);
        for(i=0;i<3;i++){
          this.despawnEffect.at(b.x+Mathf.range(this.width*1.1),b.y+Mathf.range(this.width*1.1),this.height*1.2,this.frontColor,this.width*0.25);
        }
        //if(b.data == null) return;
        b.data = [];
        for(var i = 0; i < 4; i ++){
          b.rotation(45+90*i);
          b.data[i] = Damage.collideLaser(b,this.height,false);
        }
      }
    },
    hit(b){
      
    },
    despawned(b){
      //если лазер впитан щитом, по щиту должен пройти нормальный урон
      //4 луча, которые дамажат каждые 5 тиков, и делим вполовину, чтоб слишком жирно не было
      if(b.absorbed) b.damage = this.damage*this.lifetime/5*4/2;
    },
    draw(b){
      
      Draw.color(this.backColor);
      for(var i = 0; i < 4; i ++){
        Drawf.tri(b.x,b.y,this.width+Mathf.sin(2,this.width/12),b.data == null ? this.height : Mathf.clamp(b.data[i]*1.2,0,this.height),45+90*i);
      }
      
      Draw.color(this.frontColor);
      for(i = 0; i < 4; i ++){
        Drawf.tri(b.x,b.y,(this.width+Mathf.sin(2,this.width/12))*0.55,b.data == null ? this.height : b.data[i]*0.5,45+90*i);
      }
      
    }
  });
  bullet.fragBullet.keepVelocity = false;
  bullet.fragBullet.collides = false;
  //bullet.fragBullet.hittable = false;
  //bullet.fragBullet.absorbable = false;
  bullet.fragBullet.pierce = true;
  bullet.fragBullet.frontColor = frontColor;
  bullet.fragBullet.backColor = backColor;
  bullet.fragBullet.height = laserLength;
  bullet.fragBullet.width = width;
  bullet.fragBullet.hitShake = shake;
  //шанс появления молнии каждые 5 тиков
  bullet.fragBullet.trailChance = lightningChance;
  bullet.fragBullet.lightningLength = lightningLength;
  bullet.fragBullet.damage = laserDamage;
  bullet.fragBullet.speed = 0.001;
  bullet.fragBullet.lifetime = 30;
  bullet.fragBullet.hitEffect = Fx.none;
  bullet.fragBullet.trailEffect = new Effect(14,cons(e=>{
    Draw.color(e.color);
    Lines.stroke(e.data*e.fout());
    Angles.randLenVectors(e.id,4,e.rotation*e.fin(),h.floatc2((x,y) => {
      Lines.lineAngle(e.x+x,e.y+y,Mathf.angle(x,y),(2+e.fout())*e.data);
    }));
  }));
  bullet.fragBullet.despawnEffect = new Effect(16,cons(e=>{
    Draw.color(e.color);
    Lines.stroke(e.data*e.fout());
    for(var i = 0; i < 4; i++){
      Tmp.v1.trns(45+90*i,e.rotation*e.fin());
      Lines.lineAngle(e.x+Tmp.v1.x,e.y+Tmp.v1.y,45+90*i,e.data*3);
    }
  }));

  
  
  return bullet;
  
};


/*
const thoriumBreakerHit1 = newEffect(12,e=>{
  Draw.color(Items.thorium.color);
  Lines.stroke(e.fout());
  Angles.randLenVectors(e.id,4,15*e.fin(),floatc2((x,y)=>{
    var angle = Mathf.angle(x,y);
    Lines.lineAngle(e.x+x,e.y+y,angle,1+3*e.fout());
  }));
});
*/

const thoriumBullet = thoriumBreakerBullet(30,4,50,3,Items.thorium.color,Color.valueOf("C686BAFF"),50,30,0.2,22,2,6);
const radiumBullet = thoriumBreakerBullet(40,4.4,50,3.5,Color.valueOf("8FB9AFFF"),Color.valueOf("6D968EFF"),40,50,0.13,40,2.2,8);
const surgeBullet = thoriumBreakerBullet(50,5,45,4,Items.surgeAlloy.color,Color.valueOf("E6CD6BFF"),70,50,0.5,30,2.2,8);

const thoriumBreaker = extend(ItemTurret,"thorium-breaker",{
  init(){
    this.super$init();
    this.ammo(Items.thorium,thoriumBullet,
              h.itm("radium"),radiumBullet,
              Items.surgeAlloy,surgeBullet);
  },
  load(){
    this.super$load();
    this.baseRegion = Core.atlas.find(h.mn+"block-5");
  }
});



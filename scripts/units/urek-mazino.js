const teshaders = require ("teshaders");
var tmpColor = new Color();
var vec = new Vec2();
const colors = [
                Color.valueOf("EC585855"),
                Color.valueOf("EC586CAA"),
                Color.valueOf("FF795AFF"),
                Color.valueOf("FFD0C5FF")
               ];
var tscales = [1,0.7,0.5,0.3];
var strokes = [2.6,1.8,1.1,0.6];
var lenscales = [1,1.12,1.15,1.17];
var length = 200;

const urekShot = newEffect(16,e=>{
  Draw.color(colors[1]);
  Fill.square(e.x,e.y,3*e.fout(),e.rotation+45);
  Draw.color(colors[3]);
  Fill.square(e.x,e.y,1.8*e.fout(),e.rotation+45);
});
/*
const urekShot = newEffect(16,e=>{
  Fill.quad(e.x-24,e.y-8,e.x,e.y-16,e.x+16,e.y+16,e.x+16,e.y+16);
});
*/
const urekHit = newEffect(12,e=>{
  Angles.randLenVectors(e.id,5,14*e.fin(),floatc2((x,y)=>{
    Draw.color(colors[0]);
    Fill.square(e.x+x,e.y+y,3*e.fout(),45);
    Draw.color(colors[3]);
    Fill.square(e.x+x,e.y+y,1.9*e.fout(),45);
  }));
});

const shinsuHit = newEffect(16,e=>{
  Draw.shader(teshaders.shinsu.shader);
  Lines.stroke(4*e.fout());
  Lines.circle(e.x,e.y,e.fin()*16);
  Draw.shader();
});

const urekLaser = extend(BasicBulletType,{
  update(b){
    //print(b.rot())
    if(b.timer.get(0,15)) Damage.collideLine(b, b.getTeam(), Fx.none, b.x, b.y, b.rot(), length+10, true);
  },
  draw (b){
    //Draw.shader(teshaders.shinsu.shader);
    var baseLen = length;
    /*
    for(var f = 0;f<3;f++){
      Draw.color(colors[2],b.fout())
      Tmp.v1.trns(b.rot(),40+f*40)
      Draw.rect(mn+"orbit",b.x+Tmp.v1.x,b.y+Tmp.v1.y,32-8*f+10*b.fin()*(2-f),26-8*f-8*b.fin(),b.rot()-90)
    }
    */
		for(var s = 0; s < 4; s++){
			Draw.color(tmpColor.set(colors[s]).mul(0.99 + Mathf.absin(Time.time(), 1, 0.25)));
			for(var i = 0; i < 4; i++){
			  Tmp.v1.trns(b.rot()+180, 10*(lenscales[i]-1));
				Lines.stroke((2+Mathf.absin(Time.time(), 1.4, 2))*b.fout()*strokes[s]*tscales[i]);
				Lines.lineAngle(b.x + Tmp.v1.x, b.y + Tmp.v1.y, b.rot(),baseLen*lenscales[i], CapStyle.none);
			}
		}
		/*
		for(var f = 0;f<3;f++){
		  Draw.color(colors[2],b.fout())
      Tmp.v1.trns(b.rot(),40+f*40)
      Draw.rect(mn+"orbit-back",b.x+Tmp.v1.x,b.y+Tmp.v1.y,32-8*f+10*b.fin()*(2-f),26-8*f-8*b.fin(),b.rot()-90)
    }
		*/
		Draw.reset();
		//Draw.shader();
	},
	range(){
	  return length;
	}
});
urekLaser.speed = 0.001;
urekLaser.lifetime = 14;
urekLaser.damage = 120;
urekLaser.hitEffect = urekHit;
urekLaser.despawnEffect = Fx.none;
urekLaser.keepVelocity = false;
urekLaser.pierce = true;
urekLaser.drawSize = 500;
urekLaser.shootEffect = urekShot;
urekLaser.smokeEffect = Fx.none;
urekLaser.recoil = 0;


const circleRegion = Core.atlas.find("circle");
const shinsu = extend(BasicBulletType,{
  update (b){
    this.super$update(b);
    if(b.data.time>0){
      b.x = b.data.x;
      b.y = b.data.y;
      b.time(0);
    } else if(!b.data.velScaled){
      b.velocity().scl(6);
      b.data.velScaled = true;
    }
    b.data.time-=Time.delta();
    
  },
  draw(b){
    Draw.shader(teshaders.shinsu.shader);
    if(b.data.time<=0){
      Drawf.tri(b.x,b.y,12,3+18*Mathf.clamp(b.fin()*7),b.rot()+180);
    }
    Draw.rect(circleRegion,b.x,b.y, 10, 10);
    //Draw.rect(circleRegion,b.x,b.y, 6, 6,25);
    Draw.shader();
  }
});
shinsu.damage = 50;
shinsu.splashDamage = 40;
shinsu.splashDamageRadius = 16;
shinsu.lifetime = 40;
shinsu.srink = 0;
shinsu.speed = 1;
shinsu.hitEffect = shinsu.despawnEffect = shinsuHit;
shinsu.homingPower = 0.01;
shinsu.homingRange = 80;


const urekEquip = extendContent(Weapon,"urek-mazino-gun",{
  load(){
    this.region = Core.atlas.find(mn+this.name);
  }
});
urekEquip.bullet = urekLaser;
urekEquip.reload = 30;
urekEquip.length = -6;
urekEquip.width = 22;
urekEquip.alternate = true;
urekEquip.shake = 1;



const urekMazino = extendContent (UnitType,"urek-mazino",{
  
});
urekMazino.weapon = urekEquip;


var vec = new Vec2 ();
urekMazino.create(prov(()=>extend(HoverUnit,{
  _angles: [0,0],
  _timer: new Interval(1),
  getAngles(n){
     return this._angles[n]+90;
  },
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
  shinsuBullet(delay,angle,x,y,owner,time){
    Time.run(delay,run(()=>{
      Bullet.create(shinsu,owner,owner.getTeam(),x,y,angle,1,1,{x:x,y:y,time:time,velScaled:false});
    }));
  },
  shinsuAttack(){
    var vec = new Vec2();
    var rotation = this.rotation+0;
    //var unit = this;
    for (i=0;i<6;i++){
      vec.trns(rotation-50+i*20,30);
      this.shinsuBullet(7*i,rotation-45+i*15,this.x+vec.x,this.y+vec.y,this,(6-i)*10);
    }
  },
  update(){
    if(this.target!=null){
      if(this._timer.get(0,120+Mathf.random(60,120))){
        if(this.dst(this.target)<length){
          if(this.target instanceof TileEntity){
            if(this.target.block == Blocks.spawn) return;
          }
          this.shinsuAttack();
        }
      }
    }
    this.super$update();
  },
  getPowerCellRegion (){
    return Core.atlas.find(this.type.name+"-cell");
  },
  retarget(){
    return this.timer.get(this.timerTarget, 3);
  }
})));
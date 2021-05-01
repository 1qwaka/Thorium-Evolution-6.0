const echo = extendContent (UnitType,"echo",{
  
});
var vec = new Vec2();

const echoEffect = newEffect(22,e=>{
  Draw.alpha(e.fout());
  Draw.rect(echo.region,e.x,e.y,e.rotation);
})
;
echo.create(prov(()=>extend(HoverUnit,{
  _angles: [0,0],
  _jumped: false,
  _jumpTime: 0,
  _timer: new Interval(2),
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
  getPowerCellRegion: function(){
    return Core.atlas.find(this.type.name+"-cell");
  },
  update(){
    if(this.target!=null&&this._jumpTime==0){
      if(this.velocity().len()>1.4){
        if(Mathf.chance(0.01)) this._jumpTime+=1;
      }
    }
    if(this._jumpTime>0){
      this.x+=this.velocity().x;
      this.y+=this.velocity().y;
      if(this._timer.get(0,3))Effects.effect(echoEffect,this.x,this.y,this.rotation-90);
      this._jumpTime+=Time.delta();
      if(this._jumpTime>=20){
        this._jumpTime=0;
      }
    }
    var vec = new Vec2();
    var rect = new Rect();
    this.hitbox(rect);
    if(this.timer.get(1,5)){
      Vars.bulletGroup.intersect(this.x-40,this.y-40,80,80,cons(b=>{
        if(this._jumped || b.getTeam()==this.getTeam()) return;
        vec.set(b.velocity()).scl(60);
        var v2 = Geometry.raycastRect(b.x,b.y,b.x+vec.x,b.y+vec.y,rect);
        if(v2!=null){
          if(Mathf.chance(0.1)){
            this.jump(b.rot());
            this._jumped = true;
          }
        }
      }));
    }
    this._jumped = false;
    this.super$update();
  },
  jump(rotation){
    var vec = new Vec2();
    vec.trns(rotation+90*Mathf.randomSign(),40);
    for(var i = 0;i<5;i++){
      Effects.effect(echoEffect,this.x+vec.x/5*i,this.y+vec.y/5*i,this.rotation);
    }
    this.x+=vec.x; this.y+= vec.y;
  }
})));
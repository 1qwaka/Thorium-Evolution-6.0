
const range = 88;
const statusDuration = 180;

const speedyApply = new Effect(22,cons(e=>{
  Draw.color(Color.valueOf("#36b9ef"));
  Lines.stroke(e.fout()*5);
  Lines.circle(e.x,e.y,(range+5)*e.finpow());
}));

const speedyEffect = new Effect(16,cons(e=>{
  Draw.color(Color.valueOf("#36b9ef"));
  Angles.randLenVectors(e.id,2,1+3*e.fin(),new Floatc2({get: function (x,y){
    Fill.square(e.x + x, e.y + y, e.fout() * 2.3 + 1,45);
  }}));
}));

const acceleratingEffect = new Effect(40,cons(e=>{
  Draw.color(Color.valueOf("#36b9ef"),e.fout());
  Draw.rect(acceleratingProjector.name+"-top",e.x,e.y);
}));

const speedy = new StatusEffect("speeeedy");
speedy.speedMultiplier = 1.4;
speedy.effect = speedyEffect;

const acceleratingProjector = extend(Block,"accelerating-projector",{
  range: 70,
  statusDuration: 180,
  setStats(){
    this.super$setStats();
    this.stats.add(Stat.range, +(range/Vars.tilesize).toFixed(2), StatUnit.blocks);
    this.stats.add(Stat.speedIncrease, 40, StatUnit.percent);
  },
  drawPlace(x, y, rotation,valid){
     Drawf.dashCircle(x * 8, y * 8, range, Pal.accent);
  }
});
acceleratingProjector.buildType = () => extend(Building,{
  a: 0,
  updateTile(){
    if(!this.cons.valid()) return;
    if(this.timer.get(180)){
      Units.nearby(this.team,this.x,this.y,range,cons(unit=>{
        //if(!unit.isDead()){
          unit.apply(speedy,statusDuration);
        //}
      }));
      this.a = 1;
      speedyApply.at(this);
      //acceleratingEffect.at(this);
    }
    this.a = Mathf.clamp(this.a-0.025);
  },
  drawSelect(){
    Drawf.dashCircle(this.x, this.y, range, Pal.accent);
  },
  draw(){
    this.super$draw();
    if(this.a != 0){
      Draw.color(Color.valueOf("#36b9ef"),this.a);
      Draw.rect(acceleratingProjector.name+"-top",this.x,this.y);
      Draw.alpha(1);
    }
  }
});
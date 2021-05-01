const eruption = extend(LaserTurret,"eruption",{
  load(){
    this.super$load();
    this.baseRegion = Core.atlas.find("thorium-evolution-block-6");
  }
});
eruption.buildType = () => extend(LaserTurret.LaserTurretBuild, eruption,{
  updateTile(){
    this.block.size = 1;
    this.super$updateTile();
    this.block.size = 6;
    if(this.reload > 0){
      if(Mathf.chance(0.06*Math.min(this.block.consumes.get(ConsumeType.liquid).amount,this.liquids.get(this.liquids.current())))){
        Fx.fuelburn.at(this.x + Mathf.range(24), this.y + Mathf.range(24));
      }
    }
  }
});
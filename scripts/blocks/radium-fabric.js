const shaders = require ("teshaders");

const radiumFabric = extend(GenericSmelter,"radium-fabric",{
  _bottomRegion: null,
  _rotatorRegion: null,
  load(){
    this.super$load();
    this.topRegion = Core.atlas.find("clear");
    this._bottomRegion = Core.atlas.find(this.name+"-bottom");
    this._rotatorRegion = Core.atlas.find(this.name+"-rotator");
  },
  getR(){
    return this._rotatorRegion;
  },
  getB(){
    return this._bottomRegion;
  },
  icons(){
    return [Core.atlas.find(this.name+"-bottom"),
    Core.atlas.find(this.name)];
  }
});
radiumFabric.flameColor = Items.thorium.color;
radiumFabric.buildType = () => extend(GenericSmelter.SmelterBuild,radiumFabric,{
    updateTile(){
        this.super$updateTile();
        this.totalProgress+=this.warmup;
    },
    draw(){
        Draw.rect(this.block.getB(),this.x,this.y);
        Draw.alpha(this.warmup);
        Draw.rect(this.block.getR(),this.x,this.y,this.totalProgress*4);
        Draw.alpha(1);
        Draw.sort(false);
        Draw.shader(shaders.rainbow);
        this.super$draw();
        Draw.shader();
        Draw.sort(true);
    }
});
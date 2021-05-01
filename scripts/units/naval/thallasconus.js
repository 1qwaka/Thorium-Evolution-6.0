const h = require("helplib")
const thallasconus = extend(UnitType, "thallasconus", {
    init(){
        this.super$init();
        Blocks.multiplicativeReconstructor.upgrades.add(h.javaArray(UnitType,[h.unit("talcus"),this]));
    }
});
thallasconus.constructor = prov(() => extend(UnitWaterMove, {}));
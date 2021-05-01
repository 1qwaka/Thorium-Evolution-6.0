const h = require("helplib")
const talcus = extend(UnitType, "talcus", {
    init(){
        this.super$init();
        Blocks.additiveReconstructor.upgrades.add(h.javaArray(UnitType,[h.unit("littoralis"),this]));
    }
});
talcus.constructor = prov(() => extend(UnitWaterMove, {}));
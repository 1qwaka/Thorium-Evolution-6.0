const h = require("helplib")
const littoralis = extend(UnitType, "littoralis", {
    init() {
        this.super$init();
        Blocks.navalFactory.plans.addAll(new UnitFactory.UnitPlan(this, 60 * 50,ItemStack.with(Items.silicon, 20, Items.metaglass, 20, h.itm("radium"), 20)))
        Blocks.navalFactory.capacities[h.itm("radium").id] = 20*2;
    }
});
littoralis.constructor = prov(() => extend(UnitWaterMove, {}));

const h = require("helplib");

const createMissile = function (speed, damage, radius, size, fragVelScale, fragLifeScale, frontcol, backcol) {

  var trailEffect = new Effect(24, cons(e => {
    Draw.color(e.color);
    Fill.circle(e.x, e.y, e.rotation * e.fout());
  }));

  var hitEffect = new Effect(12, cons(e => {
    Draw.color(e.color);
    Lines.stroke(Mathf.clamp(e.rotation / 32.0, 1, 2));
    Lines.circle(e.x, e.y, e.rotation * e.fin());
  }));

  var missile = extend(MissileBulletType, {
    despawned(b) {
      if (!b.absorbed) {
        Effect.shake(this.hitShake, this.hitShake, b);
        Damage.damage(b.team, b.x, b.y, this.splashDamageRadius, this.splashDamage * b.damageMultiplier());
      }
      this.fragBullet.create(b.owner, b.x + 7, b.y, 0);
      this.fragBullet.create(b.owner, b.x, b.y + 7, 90);
      this.fragBullet.create(b.owner, b.x - 7, b.y, 180);
      this.fragBullet.create(b.owner, b.x, b.y - 7, 270);
    },
    hit(b) {
      if (this.incendAmount != 0 && Mathf.chance(this.incendChance)) {
        Damage.createIncend(b.x, b.y, this.incendSpread, this.incendAmount);
      }
      this.hitEffect.at(b.x, b.y, this.splashDamageRadius, this.frontColor);
      this.hitSound.at(b);
    },
    update(b) {
      if (b.timer.get(2)) this.trailEffect.at(b.x, b.y, this.trailParam, this.trailColor);
    }
  });

  missile.lifetime = 240 / speed;
  missile.speed = speed;
  missile.damage = Mathf.round(damage * 0.5);
  missile.splashDamage = damage;
  missile.splashDamageRadius = radius;
  missile.frontColor = Color.valueOf(frontcol);
  missile.backColor = Color.valueOf(backcol);
  missile.homingPower = 0;
  missile.trailColor = Color.valueOf(frontcol);
  missile.hitColor = Color.valueOf(backcol);
  missile.trailParam = 3.3;
  missile.height = size;
  missile.width = size * 0.8;
  missile.trailEffect = trailEffect;
  missile.hitShake = 2;
  missile.hitEffect = hitEffect;

  missile.fragBullet = extend(MissileBulletType, {
    update(b) {
      if (b.timer.get(4)) this.trailEffect.at(b.x, b.y, this.trailParam, this.trailColor);
    }
  });
  missile.fragBullet.lifetime = 60 / (speed * 0.8 * fragVelScale) * fragLifeScale;
  missile.fragBullet.speed = speed * 0.8 * fragVelScale;
  missile.fragBullet.damage = damage * 0.5;
  missile.fragBullet.splashDamage = damage * 0.5;
  missile.fragBullet.splashDamageRadius = radius * 0.5;
  missile.fragBullet.frontColor = Color.valueOf(frontcol);
  missile.fragBullet.backColor = Color.valueOf(backcol);
  missile.fragBullet.homingPower = 0;
  missile.fragBullet.trailColor = Color.valueOf(frontcol);
  missile.fragBullet.hitColor = Color.valueOf(backcol);
  missile.fragBullet.trailParam = 1.8;
  missile.fragBullet.height = size * 0.9;
  missile.fragBullet.width = size * 0.9 * 0.8;
  missile.fragBullet.trailEffect = trailEffect;

  return missile;
};



const missileThorium = createMissile(4, 50, 20, 14, 1, 1, Items.thorium.color, "ed82ae");
missileThorium.inaccuracy = 2;
missileThorium.ammoMultiplier = 1.5;
const missileKardam = createMissile(4, 60, 36, 14, 1, 1, "FF7055", "E84E3F");
const missilePlast = createMissile(5, 70, 32, 14, 1.5, 0.8, Pal.plastaniumFront, Pal.plastaniumBack);
const missileRadium = createMissile(4, 80, 32, 14, 1, 1, "#5ec6b2", "6D968E");
const missileBlast = createMissile(3.8, 75, 60, 14, 0.8, 0.8, "D59180FF", "D27F6AFF");
missileBlast.inaccuracy = 4;
missileBlast.incendAmount = 4;
missileBlast.incendChance = 0.3;

const missileLauncher = extendContent(ItemTurret, "missile-launcher", {
  load() {
    this.super$load();
    this.baseRegion = Core.atlas.find(h.mn+"block-5");
  },
  icons() {
    return [Core.atlas.find(h.mn + "block-5"), Core.atlas.find(this.name)];
  },
  init() {
    this.ammo(Items.plastanium, missilePlast,
      Items.blastCompound, missileBlast,
      Items.thorium, missileThorium,
      h.itm("radium"), missileRadium,
      h.itm("kardam"), missileKardam);
    this.super$init();
  }
});
missileLauncher.buildType = prov(() => extend(ItemTurret.ItemTurretBuild, missileLauncher, {
  shoot(type) {

    for (var i = -1; i < 2; i++) {
      this.block.tr.trns(this.rotation - 90, 8 * i, 17);
      this.bullet(type, this.rotation + Mathf.range(this.block.inaccuracy + type.inaccuracy));
      type.shootEffect.at(this.x + this.block.tr.x, this.y + this.block.tr.y, this.rotation);
      type.smokeEffect.at(this.x + this.block.tr.x, this.y + this.block.tr.y, this.rotation);
    }

    this.recoil = this.block.recoilAmount;
    this.heat = 1.0;
    this.useAmmo();
    this.block.shootSound.at(this.x + this.block.tr.x, this.y + this.block.tr.y, Mathf.random(0.9, 1.1));
  },
}));
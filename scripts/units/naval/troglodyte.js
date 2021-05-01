const shaders = require("teshaders");
const h = require("helplib")

const troglodyteGreen = Color.valueOf("47f592");
const troglodyteWhite = Color.valueOf("afe0c4");

const troglodyteHit = new Effect(13, cons(e => {
    Draw.color(troglodyteGreen, troglodyteWhite, e.fin());
    Lines.stroke(2.0 * e.fout());
    Angles.randLenVectors(e.id, 7, 5 + 34 * e.fin(), new Floatc2({
        get: function (x, y) {
            Lines.lineAngle(e.x + x, e.y + y, Mathf.angle(x, y), 1.0 + e.fout() * 6.0);
        }
    }));
}))


const troglodyte = extend(UnitType, "troglodyte", {
    drawWeapons(unit) {
        //this.applyColor(unit);
        const rotation = unit.rotation - 90;

        //Draw.draw(Draw.z(), run(() => {
            this.applyColor(unit);

            for (var i in unit.mounts) {

                var mount = unit.mounts[i];
                var weapon = mount.weapon;
                var weaponRotation = rotation + mount.rotation;
                var recoil = -((mount.reload) / weapon.reload * weapon.recoil);
                var wx = unit.x + Angles.trnsx(rotation, weapon.x, weapon.y) + Angles.trnsx(weaponRotation, 0, recoil);
                var wy = unit.y + Angles.trnsy(rotation, weapon.x, weapon.y) + Angles.trnsy(weaponRotation, 0, recoil);

                Draw.rect(weapon.region,
                    wx, wy,
                    weapon.region.width * Draw.scl * -Mathf.sign(weapon.flipSprite),
                    weapon.region.height * Draw.scl,
                    weaponRotation);

                if (weapon.heatRegion.found() && mount.heat > 0) {
                    Draw.color(weapon.heatColor, mount.heat);
                    Draw.blend(Blending.additive);
                    Draw.rect(weapon.heatRegion,
                        wx, wy,
                        weapon.heatRegion.width * Draw.scl * -Mathf.sign(weapon.flipSprite),
                        weapon.heatRegion.height * Draw.scl,
                        weaponRotation);
                    Draw.blend();
                    Draw.color();
                }

            }
        //}));

        Draw.draw(Draw.z(), run(() => {
            this.applyColor(unit);

            for (var i in unit.mounts) {

                var mount = unit.mounts[i];
                var weapon = mount.weapon;
                var weaponRotation = rotation + mount.rotation;
                var recoil = -((mount.reload) / weapon.reload * weapon.recoil);
                var wx = unit.x + Angles.trnsx(rotation, weapon.x, weapon.y) + Angles.trnsx(weaponRotation, 0, recoil);
                var wy = unit.y + Angles.trnsy(rotation, weapon.x, weapon.y) + Angles.trnsy(weaponRotation, 0, recoil);

                Draw.shader(shaders.rainbowGreen);
                Draw.rect(weapon.getLightRegion(),
                    wx, wy,
                    weapon.getLightRegion().width * Draw.scl * -Mathf.sign(weapon.flipSprite),
                    weapon.getLightRegion().height * Draw.scl,
                    weaponRotation);
                Draw.shader();

            }

        }));

        Draw.reset();
    },
    init(){
        this.super$init();
        Blocks.tetrativeReconstructor.upgrades.add(h.javaArray(UnitType,[h.unit("soma"),this]));
    }
});
troglodyte.constructor = prov(() => extend(UnitWaterMove, {}));

troglodyte.weapons.add(extend(Weapon, h.mn + "troglodyte-weapon", {
    _lightRegion: null,
    load() {
        this.super$load();
        this._lightRegion = Core.atlas.find(this.name + "-light");
    },
    getLightRegion() {
        return this._lightRegion;
    },

    reload: 80,
    rotate: true,
    x: 24,
    y: 0,
    mirror: true,
    inaccuracy: 0,
    shake: 2.0,
    rotateSpeed: 1.2,
    recoil: 5,
    shootY: 18.5,
    cooldownTime: 90,

    bullet: extend(LaserBulletType, {
        length: 300,
        damage: 550,
        width: 26,
        lifetime: 40,
        hitShake: 1.0,

        lightningSpacing: 35,
        lightningLength: 3,
        lightningDelay: 0.6,
        lightningLengthRand: 8,
        lightningDamage: 60,
        lightningAngleRand: 60,

        largeHit: true,
        lightColor: Pal.heal,
        lightningColor: Pal.heal,
        hitEffect: troglodyteHit,

        sideAngle: 120,
        sideWidth: 3,
        sideLength: 42,
        colors: [Color.valueOf("47f592").mul(1, 1, 1, 0.4), troglodyteGreen, troglodyteWhite],

        fragBullet: extend(BasicBulletType, {
            speed: 0.001,
            splashDamage: 120,
            damage: 10,
            splashDamageRadius: 18,
            lifetime: 60,
            hitShake: 2.7,
            despawnEffect: Fx.none,
            absorbable: true,
            hittable: true,
            pierce: true,
            collides: false,
            keepVelocity: false,
            hitEffect: new Effect(12, cons(e => {
                Lines.stroke(2.4 * e.fout());
                Draw.color(troglodyteGreen);
                Lines.circle(e.x, e.y, 2 + 16 * e.fin());
            })),
            draw(b) {
                Draw.color(troglodyteGreen,0.81+0.04*b.fout());
                Fill.circle(b.x, b.y, b.fout() * (5 + Mathf.sin(4.2, 1.1))+2.0);
                Draw.color(troglodyteWhite,1.0);
                Fill.circle(b.x, b.y, (b.fout()+0.3) * (1.8 + Mathf.sin(4, 0.8)+1.4));
            }
        }),

        hit(b, x, y) {
            b.hit = true;
           
            Effect.shake(this.hitShake, this.hitShake, b);
            // print('x: ' + x/8 + '  y: ' + y/8)
            if(x != undefined && y != undefined){
                //Effect.shake(this.hitShake, this.hitShake, x,y);
                this.hitEffect.at(x, y, b.rotation());
                this.fragBullet.create(b, x + Mathf.range(14), y + Mathf.range(14), 0.0);
            }


        }

    })
}));

const bigBlast = new Effect(24, cons(e => {
    Draw.color(Pal.missileYellow);

    e.scaled(11, cons(s => {
        Lines.stroke(6 * s.fout());
        Lines.circle(e.x, e.y, 6 + s.fin() * 45);
    }));

    Draw.color(Color.gray);

    Angles.randLenVectors(e.id, 6, 6 + 55 * e.finpow(), new Floatc2({get:function(x, y){
        Fill.circle(e.x + x, e.y + y, e.fout() * 7.0 + 1.0);
    }}));

    Draw.color(Pal.missileYellowBack);
    Lines.stroke(2.5 * e.fout());

    Angles.randLenVectors(e.id + 228, 4, 6 + 55 * e.finpow(), new Floatc2({get:function(x, y){
        Lines.lineAngle(e.x + x, e.y + y, Mathf.angle(x, y), 1.0 + e.fout() * 8.0);
    }}));
}));

// const shootBig = new Effect(24, cons(e => {

// }));

const somaBlast = extend(BasicBulletType, {
    damage: 0,
    splashDamage: 125,
    splashDamageRadius: 60,
    trailChance: 0.1,
    trailParam: 5.0,
    // trailColor: Color.valueOf("fc4e03"),
    // frontColor: Color.valueOf("fc4e03"),
    // backColor: Color.valueOf("de4e10"),
    trailColor: Pal.missileYellowBack,
    frontColor: Pal.missileYellow,
    backColor: Pal.missileYellowBack,
    speed: 5,
    drag: 0.01,
    lifetime: 60,
    width: 22,
    height: 22,
    despawnEffect: bigBlast,
    hitEffect: bigBlast,
    hitShake: 2.0
});

const somaMissile = extend(BasicBulletType, {
    speed: 5,
    drag: 0.01,
    lifetime: 60,
    trailColor: Pal.bulletYellow,
    trailChance: 0.05,
    trailParam: 4.0,
    width: 15,
    height: 16,
    despawnEffect: Fx.blastExplosion,
    hitEffect: Fx.blastExplosion,
    hitShake: 2.0,
    damage: 10,

    fragCone: 180,
    fragBullets: 6,
    fragVelocityMin: 0.6,
    fragVelocityMax: 1.05,
    fragLifeMin: 0.8,
    fragLifeMax: 1.05,

    fragBullet: extend(MissileBulletType, {
        damage: 3,
        splashDamage: 20,
        splashDamageRadius: 32,
        speed: 3.9,
        lifetime: 45,
        homingPower: 0.1,
        weaveMag: 5,
        weaveScale: 4,
        width: 9,
        height: 10
    })
});

const somaSplit = extend(BasicBulletType, {
    damage: 10,
    speed: 5,
    drag: 0.01,
    lifetime: 50,
    trailColor: Pal.bulletYellow,
    trailChance: 0.05,
    trailParam: 4.0,
    width: 15,
    height: 16,
    despawnEffect: Fx.blastExplosion,
    hitEffect: Fx.blastExplosion,
    hitShake: 2.0,

    fragCone: 80,
    fragBullets: 6,
    fragVelocityMin: 0.8,
    fragVelocityMax: 1.05,
    fragLifeMin: 0.8,
    fragLifeMax: 1.05,

    fragBullet: extend(BasicBulletType, {
        pierce: true,
        pierceCap: 2,
        pierceBuilding: true,
        damage: 30,
        speed: 4.8,
        drag: 0.023,
        lifetime: 35,
        width: 9,
        height: 10
    })
});


const somaMainBullet = extend(BasicBulletType, {
    damage: 10,
    fragCone: 60.0,
    lifetime: 60,
    speed: 5,
    update(b) {
        this.hit(b);
        b.remove();
    },
    hit(b) {
        if(b.hit) return;
        b.hit = true;
        // просто пуля бьет по большой площади, летит дальше всех
        somaBlast.create(b, b.x, b.y, b.rotation() + Mathf.range(this.fragCone / 2), Mathf.random(1.0, 1.1), Mathf.random(1.1, 1.3));
        // разделяется на много пуль при попадании, летит на среднюю дистанцию
        somaSplit.create(b, b.x, b.y, b.rotation() + Mathf.range(this.fragCone / 2), Mathf.random(0.8, 0.9), Mathf.random(0.9, 1.0));
        // разделяется на много ракет, летит меньше всех
        somaMissile.create(b, b.x, b.y, b.rotation() + Mathf.range(this.fragCone / 2), Mathf.random(0.6, 0.8), Mathf.random(0.7, 0.9));
    },
    despawned(b) {
        this.hit(b);
    }
});

const h = require("helplib")
const soma = extend(UnitType, "soma", {
    init(){
        this.super$init();
        Blocks.exponentialReconstructor.upgrades.add(h.javaArray(UnitType,[h.unit("thallasconus"),this]));
    }
});
soma.constructor = prov(() => extend(UnitWaterMove, {}));

// soma.weapons.add(extend(Weapon, "thorium-evolution-soma-weapon", {
//     reload: 100,
//     x: 0.0,
//     y: 14.0,
//     mirror: false,
//     inaccuracy: 13.0,
//     shake: 3.0,
//     rotatespeed: 2.1,
//     rotate: true,
//     // shootEffect: 
//     bullet: somaMainBullet
// }));
soma.weapons.add(extend(Weapon, "thorium-evolution-soma-weapon", {
    reload: 180,
    x: 0.0,
    y: 14.0,
    mirror: false,
    inaccuracy: 13.0,
    shake: 3.0,
    rotateSpeed: 2.1,
    rotate: true,
    shots: 1,
    shootEffect: Fx.shootBig2,
    smokeEffect: Fx.shootBigSmoke2,
    // shadow: 2,
    recoil: 4.2,
    // shootEffect: 
    bullet: somaMainBullet
}));
soma.weapons.add(extend(Weapon, "thorium-evolution-soma-weapon", {
    reload: 115,
    x: 15.0,
    y: -8.0,
    mirror: true,
    inaccuracy: 13.0,
    shake: 3.0,
    rotateSpeed: 2.1,
    rotate: true,
    shots: 1,
    shootEffect: Fx.shootBig2,
    smokeEffect: Fx.shootBigSmoke2,
    // shadow: 2,
    recoil: 4.2,
    // shootEffect: 
    bullet: somaMainBullet
}));
// soma.weapons.add(extend(Weapon, "thorium-evolution-soma-weapon", {
//     reload: 120,
//     x: -20.0,
//     y: -8.0,
//     mirror: false,
//     inaccuracy: 13.0,
//     shake: 3.0,
//     rotatespeed: 2.1,
//     rotate: true,
//     // shootEffect: 
//     bullet: somaMissile
// }));
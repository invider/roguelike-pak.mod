// @depends(dna/bad/LifeForm)

class Person extends dna.bad.LifeForm {

    constructor(st) {
        super(st)
        this.symbol = '%'
        this.health = 100
        this.maxHealth = 100
        this.attach(dna.pod.pack)
    }

    touch(e) {
        if (this.skipLoot) return

        if (e.symbol === 'o') {
            // grab the stone
            if (this.pack.grab('stones')) {
                e.dead = true
                sfx.play('selectLow')
                this.log('+1 stone')
            }

        } else if (e.symbol === '*') {
            const plusHealth = this.eat()
            if (plusHealth > 0) {
                e.dead = true
                sfx.play('selectLow')
                this.log(`+${plusHealth} health`)

            } else if (this.pack.grab('food')) {
                e.dead = true
                sfx.play('selectLow')
                this.log('+1 food')

            }
        }
    }

    push(e) {
        if (e instanceof dna.bad.Rabbit) {
            // kill the rabbit for food
            e.kill()

            this._.spawn({
                symbol: '*',
                x: e.x,
                y: e.y,
            })

            sfx.play('selectLow')
            this.log('killed a rabbit')
        }
    }

    eat() {
        if (this.health === this.maxHealth) return 0

        let plusHealth = env.tune.healthForFood
        this.health += plusHealth
        if (this.health > this.maxHealth) {
            plusHealth -= (this.health - this.maxHealth)
            this.health = this.maxHealth
        }
        return plusHealth
    }
}

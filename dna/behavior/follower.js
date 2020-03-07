function onInstall() {
    if (!this.__.move) throw `move pod should be present in ${this.__.name}`
    this.activate()
}

function activate() {
    this.behave.type = this.name
    this.__.behave = this.behave
}

function behave() {
    const mob = this
    const world = this._

    const proximity = world.intent.get(0, mob.x, mob.y)

    if (proximity < 1) {
        mob.move.dir(RND(3))
        mob.status = 'just walking around'
        return

    } else if (proximity > 0 && proximity < 3) {
        mob.status = 'standing near the hero'
        return
    }

    const dir = world.intent.min(0, mob.x, mob.y)
    if (dir >= 0) {
        mob.move.dir(dir)
        mob.status = 'following the hero'
    } else {
        mob.move.dir(RND(3))
    }
}

function onDeinstall() {
    if (this.__.behave === this.behave) {
        this.__.behave = false 
    }
}
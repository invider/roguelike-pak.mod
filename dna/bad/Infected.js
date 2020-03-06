class Infected {

    constructor(st) {
        this.name = 'infected'
        this.map = []
        this.sources = []
        augment(this, st)
    }

    infect(x, y, type) {
        if (x < 0 || x >= this.w || y < 0 || y >= this.h) return

        const land = this.world.get(x, y)

        if (land !== '~' && land !== '^') {
            this.map[y*this.w + x] = type || 1
            return true
        }
    }

    source(x, y) {
        if (this.infect(x, y, 2)) {
            const n = env.tune.infection.minLife
                    + RND(env.tune.infection.maxLife
                        - env.tune.infection.minLife)
            this.sources.push({ x:x, y:y, n:n })
        }
    }

    killSource(src) {
        const i = this.sources.indexOf(src)
        if (i >= 0) {
            this.infect(src.x, src.y, 1)
            this.sources.splice(i, 1)
        }
    }

    spread(x, y, t, i) {
        if (!this.isInfected(x, y)) {
            const infected = this.infect(x, y)
            
            if (t === 2 && infected) {
                this.source(x, y)
            }
            return infected

        } else {
            if (!i) i = 0
            else if (i > 1024) return false

            switch(RND(7)) {
            case 0: return this.spread(x - 1, y - 1, t, i++)
            case 1: return this.spread(x + 1, y - 1, t, i++)
            case 2: return this.spread(x,     y - 1, t, i++)
            case 3: return this.spread(x - 1, y, t, i++)
            case 4: return this.spread(x + 1, y, t, i++)
            case 5: return this.spread(x - 1, y + 1, t, i++)
            case 6: return this.spread(x,     y + 1, t, i++)
            case 7: return this.spread(x + 1, y + 1, t, i++)
            }
        }
    }

    isInfected(x, y) {
        return this.map[y*this.w + x]
    }

    next() {
        for (let i = 0; i < this.sources.length; i++) {
            const src = this.sources[i]
            this.spread(src.x, src.y, 1)
            src.n --

            if (src.n <= 0) {
                const spread = this.spread(src.x, src.y, 2)
                if (spread) this.killSource(src)
            }
        }
    }
}

// @depends(dna/bad/Person)

let id = 0

class Islander extends dna.bad.Person {

    constructor(st) {
        super(st)
        this.name = 'Islander ' + (++id)
        this.symbol = '%'
        this.attach(dna.pod.pack)
    }

    touch(e) {
        super.touch(e)
        if (e.symbol === '*') this.follow()
    }

    push(e) {
        //log(this.name + ' is pushed by ' + e.name)
    }

    follow() {
        this.follower = true
        this.attach(dna.behavior.follower)
    }
}

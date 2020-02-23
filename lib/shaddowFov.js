function shaddowFov(observer, transparent) {
    const r = observer.r
    const sx = -observer.x + r
    const sy = -observer.y + r

    const map = []

    const f = {
        w: 2*r + 1,
        h: 2*r + 1,
        x: r,
        y: r,
        map: map,
        test: function (x, y) {
            const lx = x + sx
            const ly = y + sy
            if (lx < 0 || lx >= this.w
                || ly < 0 || ly >= this.h) return false
            const i = ly * this.w + lx
            return map[i]
        }
    }

    map[ r*f.w + r ] = true

    function castRays(row, start, end, xx, xy, yx, yy) {
        let newStart = 0
        if (start < end) return

		let blocked = false
		for (let distance = row; distance <= r
                            && !blocked; distance++) {
            let deltaY = -distance

            for (let deltaX = -distance; deltaX <= 0; deltaX++) {
                let currentX = round(deltaX * xx + deltaY * xy)
                let currentY = round(deltaX * yx + deltaY * yy)
                let leftSlope = (deltaX - .5) / (deltaY + .5)
                let rightSlope = (deltaX + .5) / (deltaY - .5)
 
                if ( !(currentX >= -r
                            && currentY >= -r
                            && currentX <= r
                            && currentY <= r)
                        || start < rightSlope){
                    continue
                } else if (end > leftSlope) {
                    break;
                }

                // check if it's within the lightable area and light if needed
                if (deltaX*deltaX + deltaY*deltaY <= r*r) {
                    //map[currentX][currentY] = bright;
                    const i = (currentY + r)  * f.w + (currentX + r)
                    map[i] = true
                }
 
                //const i = (currentY + r)  * f.w + (currentX + r)
                if (blocked) {
                    //previous cell was a blocking one

                    if (!transparent(currentX, currentY)) {
                        //hit a wall
                        newStart = rightSlope;
                        continue;
                    } else {
                        blocked = false;
                        start = newStart;
                    }
                } else {
                    if (!transparent(currentX, currentY)
                            && distance < r) {
                        //hit a wall within sight line
                        blocked = true;
                        castRays(distance + 1, start, leftSlope, xx, xy, yx, yy);
                        newStart = rightSlope;
                    }
                }
            }
        }
    }
    
    castRays(1, 1, 0,    -1, 0, 0, -1)
    castRays(1, 1, 0,    0, -1, -1, 0)
    castRays(1, 1, 0,    0, -1, 1, 0)
    castRays(1, 1, 0,    -1, 0, 0, 1)
    castRays(1, 1, 0,    0, 1, -1, 0)
    castRays(1, 1, 0,    1, 0, 0, -1)
    castRays(1, 1, 0,    0, 1, 1, 0)
    castRays(1, 1, 0,    1, 0, 0, 1)

    return f
}
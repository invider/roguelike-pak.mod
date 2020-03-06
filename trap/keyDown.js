function keyDown(e) {
    if (e.repeat) return

    const action = env.bind.keyMap[e.code]
    if (action && !e.metaKey && !e.altKey && !e.ctrlKey) {
        lab.control.player.act(action.id, action.player)

    } else {
        switch(e.code) {
            case 'Minus':
                lab.textMode.zoomOut()
                break
            case 'Equal':
                lab.textMode.zoomIn()
                break

            case 'KeyT':
                lab.world.autoevolve = !lab.world.autoevolve
                break
        }
    }
}

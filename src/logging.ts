
interface IDMap {
    [name: string]: boolean;
}

class LogicXLogger
{
    ids: IDMap = {};

    constructor() {
    }

    enable(id:string): void {
        this.ids[id] = true
    }

    disable(id:string): void {
        this.ids[id] = false
    }

    log (id:string, msg:string): void {
        if (this.ids[id] === true) {
            Trace(`[${id}] ${msg}`)
        }
    }

    loggerForID (id:string): (msg:string) => void {
        let self = this
        return function (msg:string): void {
            self.log(id, msg)
        }
    }
}


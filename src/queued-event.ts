
///<reference path="../typings/tsd.d.ts" />

class QueuedEvent <E extends Event>
{
    constructor(public beatstamp: number,
                public event: E) {}

    scheduleSend(): void {
        this.event.sendAtBeat(this.beatstamp)
    }
}


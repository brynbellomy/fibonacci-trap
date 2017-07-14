

//
// Helper functions
//


interface GroupPredicate <T> {
    (item:T): boolean;
}

function group <T> (seq:T[], predicate: GroupPredicate<T>): [T[], T[]] {
    let pass: T[] = []
    let fail: T[] = []

    for (let item of seq) {
        if (predicate(item)) { pass.push(item) }
        else                 { fail.push(item) }
    }
    return [pass, fail]
}

function stringify(num:number): string {
    return '' + num
}


//
// logic-specific functions
//

function convertBeatsToMS (beats:number): number {
    let timingInfo = GetTimingInfo()
    return (beats / timingInfo.tempo) * (60 * 1000)
}

function cycleIndexForBeatstamp (beatstamp:number, cycleLengthInBeats:number): number {
    return Math.floor((beatstamp - 1) / cycleLengthInBeats)
}

// function isModWheel(event:Event): boolean {
//     return (event instanceof ControlChange) && (e.number == 1)
// }

/**
    Returns the dotted length of the given note length.  For example: `dotted(1/8)` will yield 0.1875, the length (in beats) of a dotted eighth note.
 */
function dotted (noteLength:number): number {
    return noteLength * 1.5
}


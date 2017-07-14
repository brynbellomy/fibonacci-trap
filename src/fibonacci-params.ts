
///<reference path="../typings/tsd.d.ts" />

class FibonacciParams
{
    numRepeats: number;
    noteLength: number;
    minTimeBetweenRepeats: number;
    maxTimeBetweenRepeats: number;
    cycleMode: MetaNote.CycleMode;
    cycleLengthInBeats: number;

    constructor() {}
}

module FibonacciParams {
    export let allParams: Param[] = [
        NumRepeats,
        NoteLength,
        MinTimeBetweenNotes,
        MaxTimeBetweenNotes,
        CycleMode,
        CycleLengthInBeats,
    ]

    export function fetchParams(): FibonacciParams {
        let Names = FibonacciParams.Names

        let p                   = new FibonacciParams()
        p.numRepeats            = NumRepeats.getValue()
        p.noteLength            = GetParameter(Names.NoteLength)
        p.minTimeBetweenRepeats = GetParameter(Names.MinTimeBetweenNotes)
        p.maxTimeBetweenRepeats = GetParameter(Names.MaxTimeBetweenNotes)
        p.cycleMode             = MetaNote.CycleMode.fromRaw(GetParameter(Names.CycleMode))
        p.cycleLengthInBeats    = CycleLengthInBeats.getValue()

        // if the user has these backwards, just assume they meant the opposite and swap maxTime and minTime
        if (p.minTimeBetweenRepeats > p.maxTimeBetweenRepeats) {
            let temp = p.maxTimeBetweenRepeats
            p.maxTimeBetweenRepeats = p.minTimeBetweenRepeats
            p.minTimeBetweenRepeats = temp
        }
        return p
    }

    export module Names {
        export let NumRepeats = 'Number of repeats'
        export let NoteLength = 'Note length'
        export let MinTimeBetweenNotes = 'Min. time between notes'
        export let MaxTimeBetweenNotes = 'Max. time between notes'
        export let CycleMode = 'Cycle mode'
        export let CycleLengthInBeats = 'Cycle length'
    }

    export let NumRepeats = new IntegerParam(Names.NumRepeats, new Range(1, 100))
    export let NoteLength = new NumericParam(Names.NoteLength, NumericParam.Scaling.Linear, ' beats', 0, 0.25, 0.125, 127)
    export let MinTimeBetweenNotes = new NumericParam(Names.MinTimeBetweenNotes, NumericParam.Scaling.Linear, ' beats', 0.01, 1, 0.25, 255)
    export let MaxTimeBetweenNotes = new NumericParam(Names.MaxTimeBetweenNotes, NumericParam.Scaling.Linear, ' beats', 0.1, 4, 1, 255)
    export let CycleMode = new MenuParam(Names.CycleMode, ['Retrigger', 'Constant'])
    export let CycleLengthInBeats = new IntegerParam(Names.CycleLengthInBeats, new Range(1, 32))
}



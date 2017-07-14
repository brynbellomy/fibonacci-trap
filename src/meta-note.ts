
///<reference path="../typings/tsd.d.ts" />

class MetaNote
{
    prototypeNote: Note;
    pitches: number[];
    timingFunc: ITimingFunction;
    startBeat: number;
    params: FibonacciParams;

    protected beatstamps: number[];

    constructor (prototypeNote:Note, pitches:number[], currentBeatstamp:number, params:FibonacciParams) {
        this.prototypeNote = prototypeNote
        this.pitches = pitches

        this.updateParams(params)
    }

    updateParams (params:FibonacciParams): void {
        this.params = params

        switch (params.cycleMode) {
            case MetaNote.CycleMode.Constant:
                this.startBeat = 1
                break

            case MetaNote.CycleMode.Retrigger:
                this.startBeat = currentBeatstamp
                break
        }

        this.timingFunc = linearDecreaseTiming(this.params.numRepeats, this.params.minTimeBetweenRepeats, this.params.maxTimeBetweenRepeats)
        this.calculateRelativeBeatstamps()
    }


    processMIDI (timingInfo:ITimingInfo): void {
        let beatRange = new Range(timingInfo.blockStartBeat, timingInfo.blockEndBeat)

        let beatstamps = this.beatstampsForBeatRange(beatRange)
        if (beatstamps.length > 0) { Logger.log('meta-note', `beatstamps = [ ${beatstamps.join(', ')} ] out of [ ${this.beatstamps.join(', ')} ]`) }

        beatstamps.forEach((beatstamp) => {
            for (let pitch of this.pitches) {
                let note = new ConcreteNote(this.prototypeNote, this.params.noteLength)
                note.prototypeNote.pitch = pitch
                note.sendAtBeat(beatstamp)
                // note.sendAtBeat(this.startBeat + beatstamp)
            }
        })
    }

    containsPitch (pitch:number): boolean {
        return this.pitches.indexOf(pitch) >= 0
    }

    addPitch (pitch:number): void {
        if (!this.containsPitch(pitch)) {
            this.pitches.push(pitch)
        }
    }

    removePitch (pitch:number): void {
        this.pitches = this.pitches.filter((p) => pitch != p)
    }

    private calculateRelativeBeatstamps (): void {
        this.beatstamps = []

        let noteStart = 0
        for (let i = 0; i < this.params.numRepeats; i++) {
            this.beatstamps.push(noteStart)
            let beatsTilNextRepeat = this.timingFunc(i)
            noteStart += beatsTilNextRepeat
        }
    }


    private beatstampsForBeatRange (beatRange:Range): number[] {
        Logger.log('meta-note', `range = ${beatRange.toString()}`)

        let startBeat: number
        switch (this.params.cycleMode) {
            case MetaNote.CycleMode.Constant:
                let cycleIdx = cycleIndexForBeatstamp(beatRange.start, this.params.cycleLengthInBeats)
                startBeat = (this.params.cycleLengthInBeats * cycleIdx) + 1
                break

            case MetaNote.CycleMode.Retrigger:
                startBeat = this.startBeat
                break
        }

        return this.beatstamps.filter((beatstamp) => beatRange.contains(beatstamp + startBeat))
                              .map((beatstamp) => beatstamp + startBeat)
    }
}


module MetaNote {
    export enum CycleMode {
        Retrigger, Constant
    }

    export module CycleMode {
        export function fromRaw (val:number): CycleMode {
            switch (val) {
                case 0:  return CycleMode.Retrigger
                case 1:  return CycleMode.Constant
                default: throw new Error(`Unknown raw value for CycleMode (${val})`)
            }
        }
    }
}




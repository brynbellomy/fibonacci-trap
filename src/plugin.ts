
///<reference path="../typings/tsd.d.ts" />

var Logger: LogicXLogger

class Plugin
{
    currentState: Plugin.State;

    constructor() {
        this.currentState = new Plugin.State()
        Logger = new LogicXLogger()
        // Logger.enable('meta-note')
    }

    processMIDI(): void {
        let timingInfo = GetTimingInfo()

        this.currentState.currentBeatstamp = timingInfo.blockStartBeat
        Logger.log('plugin', `    -> ${timingInfo.blockStartBeat}    to    ${timingInfo.blockEndBeat}    (length: ${timingInfo.blockLength})`)

        if (!!this.currentState.currentNote) {
            this.currentState.currentNote.processMIDI(timingInfo)
        }
    }

    handleMIDI (event:Event): void {
        if (event instanceof NoteOn) {
            this.startPlayingNote(event)
        }
        else if (event instanceof NoteOff) {
            this.stopPlayingNote(event)
        }
        else {
            event.send()
        }
    }

    parameterChanged (name:string, value:number): void {
        this.
    }

    startPlayingNote (note:Note): void {
        // stop any currently playing `MetaNote`
        // this.stopPlayingNote(note)

        let params = FibonacciParams.fetchParams()

        if (this.currentState.currentNote == null) {
            this.currentState.currentNote = new MetaNote(note, [note.pitch], this.currentState.currentBeatstamp, params)
        }
        else {
            this.currentState.currentNote.addPitch(note.pitch)
        }
    }

    stopPlayingNote(note:Note): void {
        if (this.currentState.currentNote == null) {
            return
        }

        let params = FibonacciParams.fetchParams()

        if (params.cycleMode === MetaNote.CycleMode.Retrigger && this.currentState.currentNote.pitches.length <= 1)
        {
            // let noteOff = new NoteOff(this.currentState.currentNote.prototypeNote)
            // noteOff.send()
            this.currentState.currentNote = null
        }
        else {
            this.currentState.currentNote.removePitch(note.pitch)
        }
    }
}

function asdf() {

}

module Plugin
{
    export class State
    {
        currentNote: MetaNote;
        currentBeatstamp: number;

        constructor() {
            this.currentNote = null
            this.currentBeatstamp = null
        }
    }
}




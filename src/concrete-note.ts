

class ConcreteNote
{
    prototypeNote:Note;
    lengthInBeats:number;

    constructor (note:Note, lengthInBeats:number) {
        this.prototypeNote = note
        this.lengthInBeats = lengthInBeats
    }

    send (): void {
        new NoteOn(this.prototypeNote).send()
        new NoteOff(this.prototypeNote).sendAfterBeats(this.lengthInBeats)
    }

    /**
        Sends a `NoteOn` at the given `beatstamp` and a matching `NoteOff` after the duration specified by `this.lengthInBeats`.

        @param beatstamp The absolute beatstamp at which to begin playing the note.
     */
    sendAtBeat (beatstamp:number): void {
        new NoteOn(this.prototypeNote).sendAtBeat(beatstamp)
        new NoteOff(this.prototypeNote).sendAtBeat(beatstamp + this.lengthInBeats)
    }

    sendAfterBeats (beats:number): void {
        new NoteOn(this.prototypeNote).sendAfterBeats(beats)
        new NoteOff(this.prototypeNote).sendAfterBeats(beats + this.lengthInBeats)
    }

    sendAfterMilliseconds (beats:number): void {
        let ms         = convertBeatsToMS(beats)
        let lengthInMS = convertBeatsToMS(this.lengthInBeats)
        new NoteOn(this.prototypeNote).sendAfterMilliseconds(ms)
        new NoteOff(this.prototypeNote).sendAfterMilliseconds(ms + lengthInMS)
    }
}





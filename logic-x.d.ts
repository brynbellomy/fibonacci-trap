
declare class Event
{
    channel:number;

    send (): void;
    sendAfterMilliseconds (ms:number): void;
    sendAtBeat (beat:number): void;
    sendAfterBeats (beats:number): void;
    trace(): void;
}

declare class Note extends Event {
    pitch:number;
    velocity:number;
    articulationID:number;
    inStartFrame:number;
    isRealtime:boolean;
}

declare class NoteOn extends Note {
    constructor(event?:Event);
}

declare class NoteOff extends Note {
    constructor(event?:Event);
}

declare function GetParameter(name:string): number;
declare function Trace(str:string): void;
declare function GetTimingInfo(): ITimingInfo;

interface ITimingInfo
{
    /** `true` if the host transport is playing. */
    playing: boolean;
    /** `true”`means the host transport is cycling. */
    cycling:boolean;

    /** Indicates the beat position at the start of the process block. */
    blockStartBeat: number;
    /** A floating point number indicates the beat position at the end of the process block. */
    blockEndBeat:number;
    /** A floating point number indicates the length of the process block in beats. */
    blockLength:number;
    
    /** A floating point number indicates the host tempo. */
    tempo:number;
    /** An integer number indicates the host meter numerator. */
    meterNumerator:number;
    /** An integer number indicates the host meter denominator. */
    meterDenominator:number;
    
    /** A floating point number indicates the beat position at the start of the cycle range. */
    leftCycleBeat:number;
    /** A floating point number indicates the beat position at the end of the cycle range. */
    rightCycleBeat:number;
}



declare var MIDI: {
    _noteNames: string[],
    _ccNames: string[],
    noteNumber: (name:string) => number,
    noteName: (noteNumber:number) => string,
    ccName: (ccNum:number) => string,
    allNotesOff: VoidFunction,
    normalizeStatus: (value:number) => number,
    normalizeChannel: (value:number) => number,
    normalizeData: (value:number) => number,
};

interface VoidFunction {
    ();
}

interface IPrintable {
    toString(): string;
}




declare class NoteOn
{
    constructor(event:any);
    sendAfterBeats(beats:number): void;
}

declare class NoteOff
{
    constructor(event:any);
    sendAfterBeats(beats:number): void;
}

declare function GetParameter(name:string): any;



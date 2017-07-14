/**
 * ILLUMNTR: fibonacci trap
 * Logic Pro X MIDI plugin
 *
 * Copyright (C) bryn austin bellomy 2015.
 */

///<reference path="../typings/tsd.d.ts" />

// these values are part of logic x's javascript API
let NeedsTimingInfo = true
let PluginParameters = FibonacciParams.allParams

let plugin = new Plugin()

function ProcessMIDI() {
    plugin.processMIDI()
}

function HandleMIDI(event:Event): void {
    plugin.handleMIDI(event)
}

function ParameterChanged (paramIndex:number, value:number): void
{
    let param = PluginParameters[paramIndex]
    param.getValue()
}







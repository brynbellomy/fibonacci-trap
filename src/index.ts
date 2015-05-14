/**
 * ILLUMNTR: fibonacci trap
 * Logic Pro X MIDI plugin
 *
 * Copyright (C) bryn austin bellomy 2015.
 */

// import * as timing from './timing'
// import {FibonacciParams} from './fibonacci-params'
import timing = require('./timing')
import fibonacciParams = require('./fibonacci-params')
import FibonacciParams = fibonacciParams.FibonacciParams

let timingFuncConstructor: timing.ITimingFunctionConstructor = timing.linearDecreaseTiming
export let NeedsTimingInfo = true

export function HandleMIDI (event)
{
    if (event instanceof NoteOn || event instanceof NoteOff)
    {
        let params = new FibonacciParams()
        params.fetchParams()

        let timingFunc = timingFuncConstructor(params.numRepeats, params.minTimeBetweenRepeats, params.maxTimeBetweenRepeats)

        if (event instanceof NoteOn)
        {
            for (let i = 0; i < params.numRepeats; i++) {
                let spaceBetweenNotes = timingFunc(i)
                let noteStart = i * spaceBetweenNotes
                let noteEnd   = noteStart + params.noteLength

                let newNoteOn = new NoteOn(event)
                newNoteOn.sendAfterBeats(noteStart)

                let newNoteOff = new NoteOff(event)
                newNoteOff.sendAfterBeats(noteEnd)
            }

            // var pitch = GetParameter('Pitch ' + (i + 1))
            // newEvent.pitch = pitch
            // newEvent.send()
        }
    }

    // event.send()
}




/***************************
 *       GUI Controls      *
 ***************************/

let PluginParameters = FibonacciParams.initializePluginParameters()






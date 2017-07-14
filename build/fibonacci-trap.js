///<reference path="../typings/tsd.d.ts" />
var Logger;
var Plugin = (function () {
    function Plugin() {
        this.currentState = new Plugin.State();
        Logger = new LogicXLogger();
        // Logger.enable('meta-note')
    }
    Plugin.prototype.processMIDI = function () {
        var timingInfo = GetTimingInfo();
        this.currentState.currentBeatstamp = timingInfo.blockStartBeat;
        Logger.log('plugin', "    -> " + timingInfo.blockStartBeat + "    to    " + timingInfo.blockEndBeat + "    (length: " + timingInfo.blockLength + ")");
        if (!!this.currentState.currentNote) {
            this.currentState.currentNote.processMIDI(timingInfo);
        }
    };
    Plugin.prototype.handleMIDI = function (event) {
        if (event instanceof NoteOn) {
            this.startPlayingNote(event);
        }
        else if (event instanceof NoteOff) {
            this.stopPlayingNote(event);
        }
        else {
            event.send();
        }
    };
    Plugin.prototype.startPlayingNote = function (note) {
        // stop any currently playing `MetaNote`
        // this.stopPlayingNote(note)
        var params = FibonacciParams.fetchParams();
        if (this.currentState.currentNote == null) {
            this.currentState.currentNote = new MetaNote(note, [note.pitch], this.currentState.currentBeatstamp, params);
        }
        else {
            this.currentState.currentNote.addPitch(note.pitch);
        }
    };
    Plugin.prototype.stopPlayingNote = function (note) {
        if (this.currentState.currentNote == null) {
            return;
        }
        var params = FibonacciParams.fetchParams();
        if (params.cycleMode === MetaNote.CycleMode.Retrigger && this.currentState.currentNote.pitches.length <= 1) {
            // let noteOff = new NoteOff(this.currentState.currentNote.prototypeNote)
            // noteOff.send()
            this.currentState.currentNote = null;
        }
        else {
            this.currentState.currentNote.removePitch(note.pitch);
        }
    };
    return Plugin;
})();
var Plugin;
(function (Plugin) {
    var State = (function () {
        function State() {
            this.currentNote = null;
            this.currentBeatstamp = null;
        }
        return State;
    })();
    Plugin.State = State;
})(Plugin || (Plugin = {}));
var Range = (function () {
    function Range(start, end) {
        this.start = start;
        this.end = end;
    }
    Range.prototype.by = function (step) {
        var arr = [];
        for (var i = this.start; i < this.end; i += step) {
            arr.push(i);
        }
        return arr;
    };
    Range.prototype.contains = function (num) {
        if (this.start < this.end) {
            return num >= this.start && num < this.end;
        }
        else {
            return num < this.start || num >= this.end;
        }
    };
    Range.prototype.normalized = function (threshold) {
        // if (this.start < threshold && this.end < threshold) {
        //     return this
        // }
        var startBeat = (this.start % threshold);
        var endBeat = (this.end % threshold);
        return new Range(startBeat, endBeat);
    };
    Range.prototype.toString = function () { return "Range(" + this.start + " ..< " + this.end + ")"; };
    return Range;
})();
var LogicXLogger = (function () {
    function LogicXLogger() {
        this.ids = {};
    }
    LogicXLogger.prototype.enable = function (id) {
        this.ids[id] = true;
    };
    LogicXLogger.prototype.disable = function (id) {
        this.ids[id] = false;
    };
    LogicXLogger.prototype.log = function (id, msg) {
        if (this.ids[id] === true) {
            Trace("[" + id + "] " + msg);
        }
    };
    LogicXLogger.prototype.loggerForID = function (id) {
        var self = this;
        return function (msg) {
            self.log(id, msg);
        };
    };
    return LogicXLogger;
})();
//
// Helper functions
//
function group(seq, predicate) {
    var pass = [];
    var fail = [];
    for (var _i = 0; _i < seq.length; _i++) {
        var item = seq[_i];
        if (predicate(item)) {
            pass.push(item);
        }
        else {
            fail.push(item);
        }
    }
    return [pass, fail];
}
function stringify(num) {
    return '' + num;
}
//
// logic-specific functions
//
function convertBeatsToMS(beats) {
    var timingInfo = GetTimingInfo();
    return (beats / timingInfo.tempo) * (60 * 1000);
}
function cycleIndexForBeatstamp(beatstamp, cycleLengthInBeats) {
    return Math.floor((beatstamp - 1) / cycleLengthInBeats);
}
// function isModWheel(event:Event): boolean {
//     return (event instanceof ControlChange) && (e.number == 1)
// }
/**
    Returns the dotted length of the given note length.  For example: `dotted(1/8)` will yield 0.1875, the length (in beats) of a dotted eighth note.
 */
function dotted(noteLength) {
    return noteLength * 1.5;
}
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Param = (function () {
    function Param(name, type, minValue, maxValue, defaultValue) {
        this.name = name;
        this.type = type;
        this.minValue = minValue;
        this.maxValue = maxValue;
        this.defaultValue = defaultValue;
    }
    Param.prototype.getValue = function () {
        return GetParameter(this.name);
    };
    return Param;
})();
var NumericParam = (function (_super) {
    __extends(NumericParam, _super);
    function NumericParam(name, scaling, unit, minValue, maxValue, defaultValue, numberOfSteps) {
        _super.call(this, name, NumericParam.Scaling.toString(scaling), minValue, maxValue, defaultValue);
        this.name = name;
        this.scaling = scaling;
        this.unit = unit;
        this.minValue = minValue;
        this.maxValue = maxValue;
        this.defaultValue = defaultValue;
        this.numberOfSteps = numberOfSteps;
    }
    return NumericParam;
})(Param);
var NumericParam;
(function (NumericParam) {
    (function (Scaling) {
        Scaling[Scaling["Linear"] = 0] = "Linear";
        Scaling[Scaling["Logarithmic"] = 1] = "Logarithmic";
    })(NumericParam.Scaling || (NumericParam.Scaling = {}));
    var Scaling = NumericParam.Scaling;
    var Scaling;
    (function (Scaling) {
        function toString(scaling) {
            switch (scaling) {
                case Scaling.Linear: return 'linear';
                case Scaling.Logarithmic: return 'log';
            }
        }
        Scaling.toString = toString;
    })(Scaling = NumericParam.Scaling || (NumericParam.Scaling = {}));
})(NumericParam || (NumericParam = {}));
var MenuParam = (function (_super) {
    __extends(MenuParam, _super);
    function MenuParam(name, valueStrings) {
        _super.call(this, name, 'menu', 0, valueStrings.length, 0);
        this.name = name;
        this.valueStrings = valueStrings;
    }
    MenuParam.prototype.getValueString = function () {
        var idx = this.getValue();
        return this.valueStrings[idx];
    };
    return MenuParam;
})(Param);
var IntegerParam = (function (_super) {
    __extends(IntegerParam, _super);
    function IntegerParam(name, range) {
        _super.call(this, name, new Range(Math.round(range.start), Math.round(range.end))
            .by(1).map(stringify));
        this.name = name;
        this.range = range;
    }
    IntegerParam.prototype.getValue = function () {
        var val = _super.prototype.getValue.call(this);
        val += this.range.start;
        return val;
    };
    return IntegerParam;
})(MenuParam);
function linearDecreaseTiming(numRepeats, minimumLength, maximumLength) {
    var scalar = (maximumLength - minimumLength) / numRepeats;
    function lengthForRepeat(i) { return scalar * i; }
    return function (i) { return lengthForRepeat(i) + minimumLength; };
}
function goldenRatioTiming(minimumLength) {
    var phi = 1.6180339887498948482;
    return function (i) { return minimumLength * Math.pow(phi, i); };
}
///<reference path="../typings/tsd.d.ts" />
var QueuedEvent = (function () {
    function QueuedEvent(beatstamp, event) {
        this.beatstamp = beatstamp;
        this.event = event;
    }
    QueuedEvent.prototype.scheduleSend = function () {
        this.event.sendAtBeat(this.beatstamp);
    };
    return QueuedEvent;
})();
///<reference path="../typings/tsd.d.ts" />
var MetaNote = (function () {
    function MetaNote(prototypeNote, pitches, currentBeatstamp, params) {
        this.params = params;
        this.prototypeNote = prototypeNote;
        this.pitches = pitches;
        switch (params.cycleMode) {
            case MetaNote.CycleMode.Constant:
                this.startBeat = 1;
                break;
            case MetaNote.CycleMode.Retrigger:
                this.startBeat = currentBeatstamp;
                break;
        }
        this.timingFunc = linearDecreaseTiming(this.params.numRepeats, this.params.minTimeBetweenRepeats, this.params.maxTimeBetweenRepeats);
        this.calculateRelativeBeatstamps();
    }
    MetaNote.prototype.processMIDI = function (timingInfo) {
        var _this = this;
        var beatRange = new Range(timingInfo.blockStartBeat, timingInfo.blockEndBeat);
        var beatstamps = this.beatstampsForBeatRange(beatRange);
        if (beatstamps.length > 0) {
            Logger.log('meta-note', "beatstamps = [ " + beatstamps.join(', ') + " ] out of [ " + this.beatstamps.join(', ') + " ]");
        }
        beatstamps.forEach(function (beatstamp) {
            for (var _i = 0, _a = _this.pitches; _i < _a.length; _i++) {
                var pitch = _a[_i];
                var note = new ConcreteNote(_this.prototypeNote, _this.params.noteLength);
                note.prototypeNote.pitch = pitch;
                note.sendAtBeat(beatstamp);
            }
        });
    };
    MetaNote.prototype.containsPitch = function (pitch) {
        return this.pitches.indexOf(pitch) >= 0;
    };
    MetaNote.prototype.addPitch = function (pitch) {
        if (!this.containsPitch(pitch)) {
            this.pitches.push(pitch);
        }
    };
    MetaNote.prototype.removePitch = function (pitch) {
        this.pitches = this.pitches.filter(function (p) { return pitch != p; });
    };
    MetaNote.prototype.calculateRelativeBeatstamps = function () {
        this.beatstamps = [];
        var noteStart = 0;
        for (var i = 0; i < this.params.numRepeats; i++) {
            this.beatstamps.push(noteStart);
            var beatsTilNextRepeat = this.timingFunc(i);
            noteStart += beatsTilNextRepeat;
        }
    };
    MetaNote.prototype.beatstampsForBeatRange = function (beatRange) {
        Logger.log('meta-note', "range = " + beatRange.toString());
        var startBeat;
        switch (this.params.cycleMode) {
            case MetaNote.CycleMode.Constant:
                var cycleIdx = cycleIndexForBeatstamp(beatRange.start, this.params.cycleLengthInBeats);
                startBeat = (this.params.cycleLengthInBeats * cycleIdx) + 1;
                break;
            case MetaNote.CycleMode.Retrigger:
                startBeat = this.startBeat;
                break;
        }
        return this.beatstamps.filter(function (beatstamp) { return beatRange.contains(beatstamp + startBeat); })
            .map(function (beatstamp) { return beatstamp + startBeat; });
    };
    return MetaNote;
})();
var MetaNote;
(function (MetaNote) {
    (function (CycleMode) {
        CycleMode[CycleMode["Retrigger"] = 0] = "Retrigger";
        CycleMode[CycleMode["Constant"] = 1] = "Constant";
    })(MetaNote.CycleMode || (MetaNote.CycleMode = {}));
    var CycleMode = MetaNote.CycleMode;
    var CycleMode;
    (function (CycleMode) {
        function fromRaw(val) {
            switch (val) {
                case 0: return CycleMode.Retrigger;
                case 1: return CycleMode.Constant;
                default: Trace("Unknown raw value for CycleMode (" + val + ")");
            }
        }
        CycleMode.fromRaw = fromRaw;
    })(CycleMode = MetaNote.CycleMode || (MetaNote.CycleMode = {}));
})(MetaNote || (MetaNote = {}));
var ConcreteNote = (function () {
    function ConcreteNote(note, lengthInBeats) {
        this.prototypeNote = note;
        this.lengthInBeats = lengthInBeats;
    }
    ConcreteNote.prototype.send = function () {
        new NoteOn(this.prototypeNote).send();
        new NoteOff(this.prototypeNote).sendAfterBeats(this.lengthInBeats);
    };
    /**
        Sends a `NoteOn` at the given `beatstamp` and a matching `NoteOff` after the duration specified by `this.lengthInBeats`.

        @param beatstamp The absolute beatstamp at which to begin playing the note.
     */
    ConcreteNote.prototype.sendAtBeat = function (beatstamp) {
        new NoteOn(this.prototypeNote).sendAtBeat(beatstamp);
        new NoteOff(this.prototypeNote).sendAtBeat(beatstamp + this.lengthInBeats);
    };
    ConcreteNote.prototype.sendAfterBeats = function (beats) {
        new NoteOn(this.prototypeNote).sendAfterBeats(beats);
        new NoteOff(this.prototypeNote).sendAfterBeats(beats + this.lengthInBeats);
    };
    ConcreteNote.prototype.sendAfterMilliseconds = function (beats) {
        var ms = convertBeatsToMS(beats);
        var lengthInMS = convertBeatsToMS(this.lengthInBeats);
        new NoteOn(this.prototypeNote).sendAfterMilliseconds(ms);
        new NoteOff(this.prototypeNote).sendAfterMilliseconds(ms + lengthInMS);
    };
    return ConcreteNote;
})();
///<reference path="../typings/tsd.d.ts" />
var FibonacciParams = (function () {
    function FibonacciParams() {
    }
    return FibonacciParams;
})();
var FibonacciParams;
(function (FibonacciParams) {
    function initializePluginParameters() {
        return [
            FibonacciParams.NumRepeats,
            FibonacciParams.NoteLength,
            FibonacciParams.MinTimeBetweenNotes,
            FibonacciParams.MaxTimeBetweenNotes,
            FibonacciParams.CycleMode,
            FibonacciParams.CycleLengthInBeats,
        ];
    }
    FibonacciParams.initializePluginParameters = initializePluginParameters;
    function fetchParams() {
        var Names = FibonacciParams.Names;
        var p = new FibonacciParams();
        p.numRepeats = FibonacciParams.NumRepeats.getValue();
        p.noteLength = GetParameter(Names.NoteLength);
        p.minTimeBetweenRepeats = GetParameter(Names.MinTimeBetweenNotes);
        p.maxTimeBetweenRepeats = GetParameter(Names.MaxTimeBetweenNotes);
        p.cycleMode = MetaNote.CycleMode.fromRaw(GetParameter(Names.CycleMode));
        p.cycleLengthInBeats = FibonacciParams.CycleLengthInBeats.getValue();
        // if the user has these backwards, just assume they meant the opposite and swap maxTime and minTime
        if (p.minTimeBetweenRepeats > p.maxTimeBetweenRepeats) {
            var temp = p.maxTimeBetweenRepeats;
            p.maxTimeBetweenRepeats = p.minTimeBetweenRepeats;
            p.minTimeBetweenRepeats = temp;
        }
        return p;
    }
    FibonacciParams.fetchParams = fetchParams;
    var Names;
    (function (Names) {
        Names.NumRepeats = 'Number of repeats';
        Names.NoteLength = 'Note length';
        Names.MinTimeBetweenNotes = 'Min. time between notes';
        Names.MaxTimeBetweenNotes = 'Max. time between notes';
        Names.CycleMode = 'Cycle mode';
        Names.CycleLengthInBeats = 'Cycle length';
    })(Names = FibonacciParams.Names || (FibonacciParams.Names = {}));
    FibonacciParams.NumRepeats = new IntegerParam(Names.NumRepeats, new Range(1, 100));
    FibonacciParams.NoteLength = new NumericParam(Names.NoteLength, NumericParam.Scaling.Linear, ' beats', 0, 0.25, 0.125, 127);
    FibonacciParams.MinTimeBetweenNotes = new NumericParam(Names.MinTimeBetweenNotes, NumericParam.Scaling.Linear, ' beats', 0.01, 1, 0.25, 255);
    FibonacciParams.MaxTimeBetweenNotes = new NumericParam(Names.MaxTimeBetweenNotes, NumericParam.Scaling.Linear, ' beats', 0.1, 4, 1, 255);
    FibonacciParams.CycleMode = new MenuParam(Names.CycleMode, ['Retrigger', 'Constant']);
    FibonacciParams.CycleLengthInBeats = new IntegerParam(Names.CycleLengthInBeats, new Range(1, 32));
})(FibonacciParams || (FibonacciParams = {}));
/**
 * ILLUMNTR: fibonacci trap
 * Logic Pro X MIDI plugin
 *
 * Copyright (C) bryn austin bellomy 2015.
 */
///<reference path="../typings/tsd.d.ts" />
// these values are part of logic x's javascript API
var NeedsTimingInfo = true;
var PluginParameters = FibonacciParams.initializePluginParameters();
var plugin = new Plugin();
function ProcessMIDI() {
    plugin.processMIDI();
}
function HandleMIDI(event) {
    plugin.handleMIDI(event);
}

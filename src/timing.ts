


interface ITimingFunction {
    (i:number): number;
}

function linearDecreaseTiming (numRepeats: number, minimumLength: number, maximumLength: number): ITimingFunction {
    let scalar = (maximumLength - minimumLength) / numRepeats

    function lengthForRepeat(i:number): number { return scalar * i }

    return (i: number) => lengthForRepeat(i) + minimumLength
}

function goldenRatioTiming (minimumLength: number): ITimingFunction {
    let phi = 1.6180339887498948482

    return (i: number) => minimumLength * Math.pow(phi, i)
}
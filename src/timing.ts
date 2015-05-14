


export interface ITimingFunctionConstructor {
    (numRepeats: number, minimumLength: number, maximumLength: number): ITimingFunction;
}

export interface ITimingFunction {
    (i:number): number;
}

export function linearDecreaseTiming(numRepeats: number, minimumLength: number, maximumLength: number): ITimingFunction {
    let scalar = (maximumLength - minimumLength) / numRepeats
    return (i: number) => {
        return (scalar * i) + minimumLength
    }
}
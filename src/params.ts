

class Param
{
    constructor(public name:string,
                public type:string,
                public minValue:number,
                public maxValue:number,
                public defaultValue:number) {}

    getValue(): number {
        return GetParameter(this.name)
    }
}


class NumericParam extends Param
{
    constructor(public name: string,
                public scaling: NumericParam.Scaling,
                public unit: string,
                public minValue: number,
                public maxValue: number,
                public defaultValue: number,
                public numberOfSteps: number)
    {
        super(name, NumericParam.Scaling.toString(scaling), minValue, maxValue, defaultValue)
    }
}

module NumericParam {
    export enum Scaling {
        Linear, Logarithmic
    }

    export module Scaling {
        export function toString(scaling:Scaling) {
            switch (scaling) {
                case Scaling.Linear: return 'linear'
                case Scaling.Logarithmic: return 'log'
            }
        }
    }
}

class MenuParam extends Param
{
    constructor(public name:string,
                public valueStrings:string[])
    {
        super(name, 'menu', 0, valueStrings.length, 0)
    }

    getValueString(): string {
        let idx = this.getValue()
        return this.valueStrings[idx]
    }
}

class IntegerParam extends MenuParam
{
    constructor(public name:string,
                public range:Range)
    {
        super(name, new Range(Math.round(range.start),
                              Math.round(range.end))
                            .by(1).map(stringify))
    }

    getValue (): number {
        let val = super.getValue()
        val += this.range.start
        return val
    }
}



export class Param
{
    constructor(public name:string,
                public type:string,
                public minValue:number,
                public maxValue:number,
                public defaultValue:number) {}
}

export class LinearParam extends Param
{
    constructor(public name:string,
                public minValue:number,
                public maxValue:number,
                public defaultValue:number,
                public numberOfSteps:number)
    {
        super(name, 'linear', minValue, maxValue, defaultValue)
    }
}

export class MenuParam extends Param
{
    constructor(public name:string,
                public valueStrings:string[])
    {
        super(name, 'menu', 0, valueStrings.length, 0)
    }
}
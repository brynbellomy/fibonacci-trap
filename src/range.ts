


class Range
{
    constructor(public start:number, public end:number) {}

    by (step:number): number[] {
        let arr = []
        for (let i = this.start; i < this.end; i += step) {
            arr.push(i)
        }
        return arr
    }

    contains (num:number): boolean {
        if (this.start < this.end) {
            return num >= this.start && num < this.end
        }
        else {
            return num < this.start || num >= this.end
        }
    }

    normalized (threshold:number): Range {
        // if (this.start < threshold && this.end < threshold) {
        //     return this
        // }

        let startBeat = (this.start % threshold)
        let endBeat   = (this.end   % threshold)
        return new Range(startBeat, endBeat)
    }

    toString(): string { return `Range(${this.start} ..< ${this.end})` }
}

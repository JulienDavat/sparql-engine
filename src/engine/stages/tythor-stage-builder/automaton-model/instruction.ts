/**
 * @author Julien Aimonier-Davat
 */
export class Instruction {
    private _properties: string[]
    private _inverse: boolean
    private _negation: boolean

    constructor(properties: string[], inverse: boolean, negation: boolean) {
        this._properties = properties
        this._inverse = inverse
        this._negation = negation
    }

    get properties(): string[] {
        return this._properties
    }

    get inverse(): boolean {
        return this._inverse
    }

    get negation(): boolean {
        return this._negation
    }

    public equals(other: Instruction): boolean {
        if (this.negation !== other.negation || this.inverse !== other.inverse) {
            return false
        } else if (this.properties.length !== other.properties.length) {
            return false
        } else {
            for (let property of this.properties) {
                if (!other.properties.includes(property)) {
                    return false
                }
            }
            return true
        }
    }
}
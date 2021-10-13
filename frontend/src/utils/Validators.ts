import {Validity} from "@steffo/bluelib-react/dist/types"


export class Validators {
    static doNotValidate<T>(val: T): Validity {
        return undefined
    }

    static alwaysValid<T>(val: T): Validity {
        return true
    }

    static notEmpty<T>(val: T): Validity {
        if(!val) {
            return undefined
        }
        return true
    }

    static notZeroLength<T extends { length: number }>(val: T): Validity {
        if(!val) {
            return undefined
        }
        if(val.length === 0) {
            return undefined
        }
        return true
    }
}

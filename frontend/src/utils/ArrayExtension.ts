export function arrayExtension<T>(array: Array<T>, index: number, newValue: T): Array<T> {
    const clone = [...array]
    clone[index] = newValue
    return clone
}


export function arrayExclude<T>(array: Array<T>, index: number): Array<T> {
    const clone = [...array]
    delete clone[index]
    return clone
}

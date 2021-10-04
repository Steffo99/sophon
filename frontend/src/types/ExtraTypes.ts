import * as React from "react"


/**
 * An object mapping string-keys to any kind of value.
 */
export interface Dict<T> {
    [key: string]: T
}


/**
 * Props including the children key.
 */
export interface WithChildren {
    children?: React.ReactNode,
}

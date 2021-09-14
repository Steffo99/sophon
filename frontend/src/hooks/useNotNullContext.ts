import * as React from "react";


export function createNullContext<T>(): React.Context<T | null> {
    return React.createContext<T | null>(null)
}


export function useNotNullContext<T>(context: React.Context<T | null>): T {
    const ctx = React.useContext(context)

    if(!ctx) {
        throw new Error("useNotNullContext called outside its context.")
    }

    return ctx
}

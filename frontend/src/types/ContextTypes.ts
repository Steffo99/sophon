import * as React from "react"


export interface ContextData<S, A> {
    state: S,
    dispatch: React.Dispatch<A>,
}


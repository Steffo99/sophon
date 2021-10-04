import * as React from "react";


export type AbortableEffect = (abort: AbortSignal) => void


export function useAbortEffect(effect: AbortableEffect) {
    React.useEffect(
        () => {
            const abort = new AbortController()
            effect(abort.signal)

            return () => {
                abort.abort()
            }
        },
        [effect]
    )
}

import * as React from "react"
import {useLocation} from "@reach/router";
import {parsePath} from "../utils/ParsePath";

export function useSophonPath() {
    const location = useLocation()

    return React.useMemo(
        () => {
            // FIXME: Shenanigans?
            let toParse = location.pathname.replace("%25", "%")
            return parsePath(toParse)
        },
        [location]
    )
}

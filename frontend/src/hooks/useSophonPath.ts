import {useLocation} from "@reach/router"
import * as React from "react"
import {ParsedPath, parsePath} from "../utils/ParsePath"


export function useSophonPath(): ParsedPath {
    const location = useLocation()

    return React.useMemo(
        () => {
            // FIXME: Shenanigans?
            let toParse = location.pathname.replace("%25", "%")
            return parsePath(toParse)
        },
        [location],
    )
}

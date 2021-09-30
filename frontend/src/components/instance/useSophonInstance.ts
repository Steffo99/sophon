import * as React from "react";
import {SophonInstanceContext} from "./SophonInstanceContext";
import {SophonInstanceContextData} from "./Interfaces";


/**
 * Shortcut for {@link useContext} on {@link SophonInstanceContext}.
 */
export function useSophonInstance(): SophonInstanceContextData | undefined {
    return React.useContext(SophonInstanceContext)
}

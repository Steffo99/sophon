import {SophonInstanceContext} from "./SophonInstanceContext";
import {SophonInstanceContextData} from "./SophonInstanceState";
import {useDefinedContext} from "../../hooks/useDefinedContext";


/**
 * Shortcut for {@link useDefinedContext} on {@link SophonInstanceContext}.
 */
export function useSophonInstance(): SophonInstanceContextData {
    return useDefinedContext<SophonInstanceContextData>(SophonInstanceContext, "useSophonInstance")
}

import * as React from "react"
import {SophonInstanceContextData} from "./SophonInstanceState";


/**
 * The context that contains all the data about the currently selected Sophon instance.
 *
 * Must be `undefined` only when there is nothing providing the context.
 */
export const SophonInstanceContext = React.createContext<SophonInstanceContextData | undefined>(undefined)

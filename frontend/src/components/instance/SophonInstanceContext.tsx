import * as React from "react"
import {SophonInstanceContextData} from "./Interfaces";


/**
 * The context that contains all the data about the currently selected Sophon instance.
 */
export const SophonInstanceContext = React.createContext<SophonInstanceContextData | undefined>(undefined)

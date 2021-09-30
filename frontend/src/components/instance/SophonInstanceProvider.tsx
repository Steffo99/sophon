import * as React from "react"
import {useState} from "react"
import {SophonInstanceContext} from "./SophonInstanceContext";
import {SophonInstanceProviderProps, SophonInstanceState} from "./Interfaces";


/**
 * Component which provides the {@link SophonInstanceContext} to its children.
 *
 * @constructor
 */
export function SophonInstanceProvider({children}: SophonInstanceProviderProps): JSX.Element {
    const [details, setDetails] = useState<SophonInstanceState | undefined>(undefined)

    return (
        <SophonInstanceContext.Provider value={details ? {...details, setDetails} : undefined}>
            {children}
        </SophonInstanceContext.Provider>
    )
}

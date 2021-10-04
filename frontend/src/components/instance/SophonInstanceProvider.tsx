import * as React from "react"
import {useState} from "react"
import {SophonInstanceContext} from "./SophonInstanceContext";
import {SophonInstanceState} from "./SophonInstanceState";


/**
 * Props of the {@link SophonInstanceProvider}.
 */
export interface SophonInstanceProviderProps {
    children: React.ReactNode,
}


/**
 * Component which provides the {@link SophonInstanceContext} to its children, storing the current {@link SophonInstanceState} in its state.
 *
 * @constructor
 */
export function SophonInstanceProvider({children}: SophonInstanceProviderProps): JSX.Element {
    const [details, setDetails] = useState<SophonInstanceState>({})

    return (
        <SophonInstanceContext.Provider value={{...details, setDetails}}>
            {children}
        </SophonInstanceContext.Provider>
    )
}

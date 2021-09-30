import {SophonInstanceDetails} from "../../utils/SophonTypes";
import * as React from "react";

// This file exists to avoid circular imports.

/**
 * Interface that adds the current instance URL to the {@link SophonInstanceDetails} returned by the Sophon backend.
 */
export interface SophonInstanceState extends SophonInstanceDetails {
    url: URL,
}


/**
 * Interface for the {@link SophonInstanceContext} context that provides a way for consumers to alter the {@link SophonInstanceState}.
 */
export interface SophonInstanceContextData extends SophonInstanceState {
    setDetails?: React.Dispatch<React.SetStateAction<SophonInstanceState | undefined>>
}


/**
 * Props of the {@link SophonInstanceProvider}.
 */
export interface SophonInstanceProviderProps {
    children: React.ReactNode,
}
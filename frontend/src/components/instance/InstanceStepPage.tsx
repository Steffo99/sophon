import {Chapter} from "@steffo/bluelib-react"
import * as React from "react"
import {WhatIsSophonBox} from "../informative/WhatIsSophonBox"
import {InstanceFormBox} from "./InstanceFormBox"


/**
 * Page displayed by the {@link InstanceRouter} whenever no instance is selected, providing some information about Sophon to the user and allowing
 * them to select an instance and proceed to login.
 *
 * @constructor
 */
export function InstanceStepPage(): JSX.Element {
    return (
        <Chapter>
            <WhatIsSophonBox/>
            <InstanceFormBox/>
        </Chapter>
    )
}

import {faServer} from "@fortawesome/free-solid-svg-icons"
import * as React from "react"
import {DescriptionBox} from "../elements/DescriptionBoxProps"


export function SophonDescriptionBox(): JSX.Element {
    return (
        <DescriptionBox
            icon={faServer}
            name={"Sophon"}
            description={"Sophon is software that allows you to store, execute, and optionally share your research in a secure cloud hosted by your institution."}
        />
    )
}

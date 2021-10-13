import {faUniversity} from "@fortawesome/free-solid-svg-icons"
import * as React from "react"
import {useInstanceContext} from "../../contexts/instance"
import {DescriptionBox} from "../elements/DescriptionBoxProps"
import {ErrorBox} from "../errors/ErrorBox"


export function InstanceDescriptionBox(): JSX.Element | null {
    const instance = useInstanceContext()

    if(!instance) {
        return <ErrorBox error={new Error("This component is being rendered outside an InstanceContext.")}/>
    }

    if(!instance.state.details) {
        return null
    }

    if(!instance.state.details.description) {
        return null
    }

    return (
        <DescriptionBox
            icon={faUniversity}
            name={instance.state.details.name}
            description={instance.state.details.description}
        />
    )
}

import * as React from "react"
import {useInstance} from "./InstanceContext";
import {Bluelib} from "@steffo/bluelib-react";


interface InstanceBluelibProps {
    children: React.ReactNode
}


export function InstanceBluelib({children}: InstanceBluelibProps): JSX.Element {
    const instance = useInstance()

    return (
        <Bluelib theme={instance.details?.theme ?? "sophon"}>
            {children}
        </Bluelib>
    )
}

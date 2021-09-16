import * as React from "react"
import * as ReactDOM from "react-dom"
import {InstanceBox} from "../components/InstanceBox";
import {Chapter, Heading} from "@steffo/bluelib-react";


interface AccountPageProps {

}


export function AccountPage({}: AccountPageProps): JSX.Element {
    return (
        <>
            <Heading level={1}>
                Sophon
            </Heading>
            <InstanceBox/>
        </>
    )
}

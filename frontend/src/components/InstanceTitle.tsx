import * as React from "react"
import {Heading} from "@steffo/bluelib-react"
import {useInstance, useInstanceAxios} from "./InstanceContext";
import {InstanceDetails} from "../types";
import {Link} from "./Link";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSpinner, faTimesCircle, faUniversity} from "@fortawesome/free-solid-svg-icons";
import {Loading} from "./Loading";


export function InstanceTitle(): JSX.Element {
    const instance = useInstance()

    if(instance.details?.name) {
        return (
            <Heading level={1}>
                <Link href={"/"}>
                    <FontAwesomeIcon icon={faUniversity}/>&nbsp;{instance.details.name}
                </Link>
            </Heading>
        )
    }
    else {
        return (
            <Heading level={1} bluelibClassNames={"color-red"}>
                <Link href={"/"}>
                    Sophon
                </Link>
            </Heading>
        )
    }
}

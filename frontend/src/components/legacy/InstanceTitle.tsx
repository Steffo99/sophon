import * as React from "react"
import {Heading} from "@steffo/bluelib-react"
import {useInstance} from "./login/InstanceContext";
import {Link} from "../elements/Link";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUniversity} from "@fortawesome/free-solid-svg-icons";


export function InstanceTitle(): JSX.Element {
    const instance = useInstance()

    if (instance.details?.name) {
        return (
            <Heading level={1}>
                <Link href={"/"}>
                    <FontAwesomeIcon icon={faUniversity}/>&nbsp;{instance.details.name}
                </Link>
            </Heading>
        )
    } else {
        return (
            <Heading level={1} bluelibClassNames={"color-red"}>
                <Link href={"/"}>
                    Sophon
                </Link>
            </Heading>
        )
    }
}

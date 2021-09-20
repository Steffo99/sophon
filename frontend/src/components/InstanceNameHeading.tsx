import * as React from "react"
import {Heading} from "@steffo/bluelib-react"
import {useInstance, useInstanceAxios} from "./InstanceContext";
import {InstanceDetails} from "../types";
import {Link} from "./Link";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSpinner, faTimesCircle, faUniversity} from "@fortawesome/free-solid-svg-icons";
import {Loading} from "./Loading";


export function InstanceNameHeading(): JSX.Element {
    const instance = useInstance()
    const api = useInstanceAxios()

    const [details, setDetails] = React.useState<InstanceDetails | null>(null)
    const [error, setError] = React.useState<Error | null>(null)

    React.useEffect(
        () => {
            if(instance.validity === true) {
                const controller = new AbortController()

                setError(null)
                api.get("/api/core/instance", {signal: controller.signal})
                    .then(r => setDetails(r.data))
                    .catch(e => {
                        if(!controller.signal.aborted) {
                            setError(e)
                        }
                    })

                return () => {
                    controller.abort()
                }
            }
        },
        [api, setDetails, setError]
    )

    if(!instance.validity) {
        return (
            <Heading level={1} bluelibClassNames={"color-red"}>
                <Link href={"/"}>
                    Sophon
                </Link>
            </Heading>
        )
    }
    if(error) {
        return (
            <Heading level={1} bluelibClassNames={"color-red"}>
                <Link href={"/"}>
                    <FontAwesomeIcon icon={faTimesCircle}/>&nbsp;Error
                </Link>
            </Heading>
        )
    }
    else if(details === null) {
        return (
            <Heading level={1} bluelibClassNames={"color-cyan"}>
                <Link href={"/"}>
                    <Loading/>
                </Link>
            </Heading>
        )
    }
    else {
        return (
            <Heading level={1}>
                <Link href={"/"}>
                    <FontAwesomeIcon icon={faUniversity}/>&nbsp;{details.name}
                </Link>
            </Heading>
        )
    }

}

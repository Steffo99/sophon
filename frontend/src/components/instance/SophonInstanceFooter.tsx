import * as React from "react"
import {Anchor, Footer} from "@steffo/bluelib-react";
import {useSophonInstance} from "./useSophonInstance";


const FOOTER_COLORS = {
    development: "color-yellow",
    test: "color-cyan",
    production: "",
}

const SOPHON_REPO_URL = "https://github.com/Steffo99/sophon"
const FRONTEND_REPO_URL = "https://github.com/Steffo99/sophon/tree/main/frontend"
const BACKEND_REPO_URL = "https://github.com/Steffo99/sophon/tree/main/backend"
const LICENSE_URL = "https://github.com/Steffo99/sophon/blob/main/LICENSE.txt"


export function SophonInstanceFooter(): JSX.Element {
    const instance = useSophonInstance()

    return (
        <Footer bluelibClassNames={FOOTER_COLORS[process.env.NODE_ENV]}>
            <Anchor href={SOPHON_REPO_URL}>
                Sophon
            </Anchor>
            &nbsp;|&nbsp;
            <Anchor href={FRONTEND_REPO_URL}>
                Frontend {process.env.NODE_ENV === "development" ? "Dev" : process.env.NODE_ENV === "test" ? "Test" : process.env.REACT_APP_VERSION}
            </Anchor>
            &nbsp;|&nbsp;
            <Anchor href={BACKEND_REPO_URL}>
                Backend {instance?.version ?? "not connected"}
            </Anchor>
            &nbsp;|&nbsp;
            <Anchor href={LICENSE_URL}>
                AGPL 3.0+
            </Anchor>
        </Footer>
    )
}

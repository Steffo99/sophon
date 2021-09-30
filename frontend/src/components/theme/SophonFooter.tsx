import * as React from "react"
import {useContext} from "react"
import {Anchor, Footer} from "@steffo/bluelib-react";
import {LookAndFeelContext} from "./LookAndFeel";


const FOOTER_COLORS = {
    development: "color-yellow",
    test: "color-cyan",
    production: "",
}

const SOPHON_REPO_URL = "https://github.com/Steffo99/sophon"
const FRONTEND_REPO_URL = "https://github.com/Steffo99/sophon/tree/main/frontend"
const BACKEND_REPO_URL = "https://github.com/Steffo99/sophon/tree/main/backend"
const LICENSE_URL = "https://github.com/Steffo99/sophon/blob/main/LICENSE.txt"


export function SophonFooter(): JSX.Element {
    const lookAndFeel = useContext(LookAndFeelContext)

    const frontendVersion = process.env.REACT_APP_VERSION
    const backendVersion = lookAndFeel.backendVersion

    return (
        <Footer bluelibClassNames={FOOTER_COLORS[process.env.NODE_ENV]}>
            <Anchor href={SOPHON_REPO_URL}>
                Sophon
            </Anchor>
            &nbsp;|&nbsp;
            <Anchor href={FRONTEND_REPO_URL}>
                Frontend {process.env.NODE_ENV === "development" ? "Dev" : process.env.NODE_ENV === "test" ? "Test" : frontendVersion}
            </Anchor>
            &nbsp;|&nbsp;
            <Anchor href={BACKEND_REPO_URL}>
                Backend {backendVersion ?? "not connected"}
            </Anchor>
            &nbsp;|&nbsp;
            <Anchor href={LICENSE_URL}>
                AGPL 3.0+
            </Anchor>
        </Footer>
    )
}

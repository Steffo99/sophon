import * as React from "react"
import * as Reach from "@reach/router"
import { LoginPage } from "./LoginPage"
import { Heading } from "@steffo/bluelib-react"
import { SelectResearchGroupPage } from "./SelectResearchGroupPage"


export function Router() {
    return <>
        <Heading level={1}>
            Sophon
        </Heading>
        <Reach.Router>
            <LoginPage path={"/"}/>
            <SelectResearchGroupPage path={"/g/"}/>
        </Reach.Router>
    </>
}

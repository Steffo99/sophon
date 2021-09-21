import * as React from "react"
import * as Reach from "@reach/router"
import { LoginPage } from "./LoginPage"
import { InstancePage } from "./InstancePage"
import { ErrorCatcherBox, NotFoundBox } from "../components/ErrorBox"
import { InstanceTitle } from "../components/InstanceTitle"
import { UserPage } from "./UserPage"
import { ResearchGroupPage } from "./ResearchGroupPage"


export function Router() {
    // noinspection RequiredAttributes
    return <>
        <Reach.Router primary={false}>
            <InstanceTitle default/>
        </Reach.Router>
        <ErrorCatcherBox>
            <Reach.Router primary={true}>
                <LoginPage path={"/"}/>
                <InstancePage path={"/g/"}/>
                <ResearchGroupPage path={"/g/:pk"}/>
                <UserPage path={"/u/:pk"}/>
                <NotFoundBox default/>
            </Reach.Router>
        </ErrorCatcherBox>
    </>
}

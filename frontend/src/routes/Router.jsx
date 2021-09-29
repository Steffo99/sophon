import * as React from "react"
import * as Reach from "@reach/router"
import { LoginPage } from "./LoginPage"
import { ErrorCatcherBox, NotFoundBox } from "../components/ErrorBox"
import { InstanceTitle } from "../components/legacy/InstanceTitle"


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
                <NotFoundBox default/>
            </Reach.Router>
        </ErrorCatcherBox>
    </>
}

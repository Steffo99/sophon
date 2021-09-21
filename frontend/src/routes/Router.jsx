import * as React from "react"
import * as Reach from "@reach/router"
import { LoginPage } from "./LoginPage"
import { SelectResearchGroupPage } from "./SelectResearchGroupPage"
import { ErrorCatcherBox, NotFoundBox } from "../components/ErrorBox"
import { InstanceTitle } from "../components/InstanceTitle"


export function Router() {
    return <>
        <Reach.Router primary={false}>
            <InstanceTitle default/>
        </Reach.Router>
        <ErrorCatcherBox>
            <Reach.Router primary={true}>
                <LoginPage path={"/"}/>
                <SelectResearchGroupPage path={"/g/"}/>
                <NotFoundBox default/>
            </Reach.Router>
        </ErrorCatcherBox>
    </>
}

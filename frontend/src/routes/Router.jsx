import * as React from "react"
import * as Reach from "@reach/router"
import { LoginPage } from "./LoginPage"
import { InstancePage } from "./InstancePage"
import { ErrorCatcherBox, NotFoundBox } from "../components/ErrorBox"
import { InstanceTitle } from "../components/InstanceTitle"
import { UserPage } from "./UserPage"


export function Router() {
    return <>
        <Reach.Router primary={false}>
            <InstanceTitle default/>
        </Reach.Router>
        <ErrorCatcherBox>
            <Reach.Router primary={true}>
                <LoginPage path={"/"}/>
                <InstancePage path={"/g/"}/>
                <UserPage path={"/u/:pk"}/>
                <NotFoundBox default/>
            </Reach.Router>
        </ErrorCatcherBox>
    </>
}

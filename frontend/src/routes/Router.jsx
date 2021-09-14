import * as React from "react"
import * as ReactDOM from "react-dom"
import * as Reach from "@reach/router"
import {AccountPage} from "./AccountPage";


export function Router({}) {
    return (
        <Reach.Router>
            <AccountPage path={"/"}/>
        </Reach.Router>
    )
}

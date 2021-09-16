import * as React from "react"
import * as ReactDOM from "react-dom"
import * as Reach from "@reach/router"
import {LoginPage} from "./LoginPage";


export function Router({}) {
    return (
        <Reach.Router>
            <LoginPage path={"/login"}/>
        </Reach.Router>
    )
}

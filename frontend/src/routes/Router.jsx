import * as React from "react"
import * as ReactDOM from "react-dom"
import * as Reach from "@reach/router"
import {LoginPage} from "./LoginPage";
import { Heading } from "@steffo/bluelib-react"


export function Router({}) {
    return <>
        <Heading level={1}>
            Sophon
        </Heading>
        <Reach.Router>
            <LoginPage path={"/"}/>
        </Reach.Router>
    </>
}

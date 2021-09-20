import * as React from "react"
import * as Reach from "@reach/router"
import { LoginPage } from "./LoginPage"
import { Heading } from "@steffo/bluelib-react"
import { SelectResearchGroupPage } from "./SelectResearchGroupPage"
import {Link} from "../components/Link"


function Header() {
    return (
        <Heading level={1}>
            <Link href={"/"}>Sophon</Link>
        </Heading>
    )
}


export function Router() {
    return <>
        <Reach.Router primary={false}>
            <Header default/>
        </Reach.Router>
        <Reach.Router>
            <LoginPage path={"/"}/>
            <SelectResearchGroupPage path={"/g/"}/>
        </Reach.Router>
    </>
}

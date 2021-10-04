import * as React from "react"
import {LoginProvider} from "./LoginProvider";
import {LoginRouter} from "./LoginRouter";
import {EMPTY_OBJECT} from "../../constants";
import {DebugBox} from "../placeholder/DebugBox";
import {LoginPage} from "./LoginPage";


export interface LoginContainerProps {

}


export function LoginContainer({}: LoginContainerProps): JSX.Element {
    return (
        <LoginProvider>
            <LoginRouter
                unselectedRoute={LoginPage}
                unselectedProps={EMPTY_OBJECT}
                selectedRoute={DebugBox}
                selectedProps={EMPTY_OBJECT}
            />
        </LoginProvider>
    )
}

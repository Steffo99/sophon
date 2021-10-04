import * as React from "react"
import * as Instance from "./index"
import {LayoutThreeCol} from "@steffo/bluelib-react"
import {ErrorCatcherBox} from "../errors/ErrorCatcherBox"
import {SophonFooter} from "../elements/SophonFooter"
import * as Reach from "@reach/router"
import {RouteComponentProps} from "@reach/router"
import {SophonInstanceRouter} from "./SophonInstanceRouter"
import {SophonInstancePage} from "./SophonInstancePage"
import {EMPTY_OBJECT} from "../../constants"
import {LoginContainer} from "../login/LoginContainer";


export interface SophonInstanceContainerProps {

}


/**
 *
 *
 * @constructor
 */
const DefaultRoute = (_: RouteComponentProps) => (
    <SophonInstanceRouter
        unselectedRoute={<SophonInstancePage/>}
        unselectedProps={EMPTY_OBJECT}
        selectedRoute={<LoginContainer/>}
        selectedProps={EMPTY_OBJECT}
    />
)


/**
 * The main rendered object for the SophonInstance context.
 *
 * @constructor
 */
export function SophonInstanceContainer({}: SophonInstanceContainerProps): JSX.Element {
    return (
        <Instance.Provider>
            <Instance.Bluelib>
                <LayoutThreeCol>
                    <LayoutThreeCol.Center>
                        <Instance.Heading level={1}/>
                        <ErrorCatcherBox>
                            <Reach.Router>
                                <DefaultRoute default/>
                            </Reach.Router>
                        </ErrorCatcherBox>
                        <SophonFooter/>
                    </LayoutThreeCol.Center>
                </LayoutThreeCol>
            </Instance.Bluelib>
        </Instance.Provider>
    )
}

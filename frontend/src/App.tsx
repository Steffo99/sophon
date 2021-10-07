import * as Reach from "@reach/router"
import {RouteComponentProps} from "@reach/router"
import {LayoutThreeCol} from "@steffo/bluelib-react"
import * as React from "react"
import {AuthorizationRouter} from "./components/authorization/AuthorizationRouter"
import {AuthorizationStepPage} from "./components/authorization/AuthorizationStepPage"
import {SophonFooter} from "./components/elements/SophonFooter"
import {ErrorCatcherBox} from "./components/errors/ErrorCatcherBox"
import {GroupRouter} from "./components/group/GroupRouter"
import {InstanceRouter} from "./components/instance/InstanceRouter"
import {InstanceStepPage} from "./components/instance/InstanceStepPage"
import {DebugBox} from "./components/placeholder/DebugBox"
import {ThemedBluelib} from "./components/theme/ThemedBluelib"
import {ThemedTitle} from "./components/theme/ThemedTitle"
import {AuthorizationProvider} from "./contexts/authorization"
import {InstanceProvider} from "./contexts/instance"
import {ThemeProvider} from "./contexts/theme"


function App({...props}: RouteComponentProps) {
    return (
        <InstanceProvider>
            <InstanceRouter
                unselectedRoute={() => <>
                    <InstanceStepPage/>
                </>}
                selectedRoute={() => <>
                    <AuthorizationProvider>
                        <AuthorizationRouter
                            unselectedRoute={() => <>
                                <AuthorizationStepPage/>
                            </>}
                            selectedRoute={() => <>
                                <GroupRouter
                                    unselectedRoute={DebugBox}
                                    selectedRoute={DebugBox}
                                />
                            </>}
                        />
                    </AuthorizationProvider>
                </>}
            />
        </InstanceProvider>
    )
}


export default function AppWrapper() {
    return (
        <ThemeProvider>
            <ThemedBluelib>
                <LayoutThreeCol>
                    <LayoutThreeCol.Center>
                        <ThemedTitle level={1}/>
                        <ErrorCatcherBox>
                            <Reach.Router>
                                <App default/>
                            </Reach.Router>
                        </ErrorCatcherBox>
                        <SophonFooter/>
                    </LayoutThreeCol.Center>
                </LayoutThreeCol>
            </ThemedBluelib>
        </ThemeProvider>
    )
}

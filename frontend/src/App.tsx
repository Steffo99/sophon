import * as Reach from "@reach/router"
import {RouteComponentProps} from "@reach/router"
import {LayoutThreeCol} from "@steffo/bluelib-react"
import * as React from "react"
import {AuthorizationRouter} from "./components/authorization/AuthorizationRouter"
import {AuthorizationStepPage} from "./components/authorization/AuthorizationStepPage"
import {SophonFooter} from "./components/elements/SophonFooter"
import {ErrorCatcherBox} from "./components/errors/ErrorCatcherBox"
import {GroupListBox} from "./components/group/GroupListBox"
import {GroupRouter} from "./components/group/GroupRouter"
import {InstanceRouter} from "./components/instance/InstanceRouter"
import {InstanceStepPage} from "./components/instance/InstanceStepPage"
import {NotebookListBox} from "./components/notebook/NotebookListBox"
import {NotebookRouter} from "./components/notebook/NotebookRouter"
import {DebugBox} from "./components/placeholder/DebugBox"
import {ProjectListBox} from "./components/project/ProjectListBox"
import {ProjectRouter} from "./components/project/ProjectRouter"
import {ThemedBluelib} from "./components/theme/ThemedBluelib"
import {ThemedTitle} from "./components/theme/ThemedTitle"
import {AuthorizationProvider} from "./contexts/authorization"
import {InstanceProvider} from "./contexts/instance"
import {ThemeProvider} from "./contexts/theme"


function App({}: RouteComponentProps) {
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
                                    unselectedRoute={(props) => <GroupListBox viewSet={props.viewSet}/>}
                                    selectedRoute={(props) => <>
                                        <ProjectRouter
                                            groupPk={props.selection.value.slug}
                                            unselectedRoute={(props) => <ProjectListBox viewSet={props.viewSet}/>}
                                            selectedRoute={(props) => <>
                                                <NotebookRouter
                                                    projectPk={props.selection.value.slug}
                                                    unselectedRoute={(props) => <NotebookListBox viewSet={props.viewSet}/>}
                                                    selectedRoute={DebugBox}
                                                />
                                            </>}
                                        />
                                    </>}
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

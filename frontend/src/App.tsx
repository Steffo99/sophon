import * as Reach from "@reach/router"
import {RouteComponentProps} from "@reach/router"
import {LayoutThreeCol} from "@steffo/bluelib-react"
import * as React from "react"
import {AuthorizationRouter} from "./components/authorization/AuthorizationRouter"
import {AuthorizationStepPage} from "./components/authorization/AuthorizationStepPage"
import {SophonFooter} from "./components/elements/SophonFooter"
import {ErrorCatcherBox} from "./components/errors/ErrorCatcherBox"
import {GroupCreateBox} from "./components/group/GroupCreateBox"
import {GroupDescriptionBox} from "./components/group/GroupDescriptionBox"
import {GroupListBox} from "./components/group/GroupListBox"
import {GroupRouter} from "./components/group/GroupRouter"
import {InstanceDescriptionBox} from "./components/instance/InstanceDescriptionBox"
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
import {CacheProvider} from "./contexts/cache"
import {InstanceProvider} from "./contexts/instance"
import {ThemeProvider} from "./contexts/theme"


function App({..._}: RouteComponentProps) {
    return (
        <InstanceProvider>
            <InstanceRouter
                unselectedRoute={() => <>
                    <InstanceStepPage/>
                </>}
                selectedRoute={() => <>
                    <InstanceDescriptionBox/>
                    <AuthorizationProvider>
                        <AuthorizationRouter
                            unselectedRoute={() => <>
                                <AuthorizationStepPage/>
                            </>}
                            selectedRoute={() => <>
                                <CacheProvider>
                                    <GroupRouter
                                        unselectedRoute={({viewSet}) => <>
                                            <GroupListBox viewSet={viewSet}/>
                                            <GroupCreateBox viewSet={viewSet}/>
                                        </>}
                                        selectedRoute={({selection}) => <>
                                            <GroupDescriptionBox resource={selection}/>
                                            <ProjectRouter
                                                groupPk={selection.value.slug}
                                                unselectedRoute={({viewSet}) => <ProjectListBox viewSet={viewSet}/>}
                                                selectedRoute={({selection}) => <>
                                                    <NotebookRouter
                                                        projectPk={selection.value.slug}
                                                        unselectedRoute={({viewSet}) => <NotebookListBox viewSet={viewSet}/>}
                                                        selectedRoute={DebugBox}
                                                    />
                                                </>}
                                            />
                                        </>}
                                    />
                                </CacheProvider>
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

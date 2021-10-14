import {faProjectDiagram, faUsers} from "@fortawesome/free-solid-svg-icons"
import * as Reach from "@reach/router"
import {RouteComponentProps} from "@reach/router"
import {Chapter, LayoutThreeCol} from "@steffo/bluelib-react"
import * as React from "react"
import {AuthorizationRouter} from "./components/authorization/AuthorizationRouter"
import {AuthorizationStepPage} from "./components/authorization/AuthorizationStepPage"
import {SophonFooter} from "./components/elements/SophonFooter"
import {ErrorCatcherBox} from "./components/errors/ErrorCatcherBox"
import {ResourceDescriptionBox} from "./components/generic/ResourceDescriptionBox"
import {GroupCreateBox} from "./components/group/GroupCreateBox"
import {GroupMembersBox} from "./components/group/GroupMembersBox"
import {GroupRouter} from "./components/group/GroupRouter"
import {GroupStepPage} from "./components/group/GroupStepPage"
import {SophonDescriptionBox} from "./components/informative/SophonDescriptionBox"
import {InstanceDescriptionBox} from "./components/instance/InstanceDescriptionBox"
import {InstanceFormBox} from "./components/instance/InstanceFormBox"
import {InstanceRouter} from "./components/instance/InstanceRouter"
import {NotebookListBox} from "./components/notebook/NotebookListBox"
import {NotebookRouter} from "./components/notebook/NotebookRouter"
import {DebugBox} from "./components/placeholder/DebugBox"
import {ProjectCreateBox} from "./components/project/ProjectCreateBox"
import {ProjectListBox} from "./components/project/ProjectListBox"
import {ProjectRouter} from "./components/project/ProjectRouter"
import {ThemedBluelib} from "./components/theme/ThemedBluelib"
import {ThemedTitle} from "./components/theme/ThemedTitle"
import {AuthorizationProvider} from "./contexts/authorization"
import {CacheProvider} from "./contexts/cache"
import {GroupProvider} from "./contexts/group"
import {InstanceProvider} from "./contexts/instance"
import {ThemeProvider} from "./contexts/theme"


function App({..._}: RouteComponentProps) {
    return React.useMemo(
        () => <>
            <Chapter>
                <SophonDescriptionBox/>
            </Chapter>
            <InstanceProvider>
                <InstanceRouter
                    unselectedRoute={() => <>
                        <InstanceFormBox/>
                    </>}
                    selectedRoute={() => <>
                        <Chapter>
                            <InstanceDescriptionBox/>
                        </Chapter>
                        <AuthorizationProvider>
                            <CacheProvider>
                                <AuthorizationRouter
                                    unselectedRoute={AuthorizationStepPage}
                                    selectedRoute={() => <>
                                        <GroupRouter
                                            unselectedRoute={GroupStepPage}
                                            selectedRoute={({selection}) => <>
                                                <GroupProvider resource={selection}>
                                                    <Chapter>
                                                        <ResourceDescriptionBox resource={selection} icon={faUsers}/>
                                                        <GroupMembersBox/>
                                                    </Chapter>
                                                    <ProjectRouter
                                                        groupPk={selection.value.slug}
                                                        unselectedRoute={({viewSet}) => <>
                                                            <GroupCreateBox resource={selection}/>
                                                            <ProjectListBox viewSet={viewSet}/>
                                                            <ProjectCreateBox viewSet={viewSet}/>
                                                        </>}
                                                        selectedRoute={({selection}) => <>
                                                            <ResourceDescriptionBox resource={selection} icon={faProjectDiagram}/>
                                                            <ProjectCreateBox resource={selection}/>
                                                            <NotebookRouter
                                                                projectPk={selection.value.slug}
                                                                unselectedRoute={({viewSet}) => <>
                                                                    <NotebookListBox viewSet={viewSet}/>
                                                                </>}
                                                                selectedRoute={(props) => <>
                                                                    <DebugBox {...props}/>
                                                                </>}
                                                            />
                                                        </>}
                                                    />
                                                </GroupProvider>
                                            </>}
                                        />
                                    </>}
                                />
                            </CacheProvider>
                        </AuthorizationProvider>
                    </>}
                />
            </InstanceProvider>
        </>,
        [],
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

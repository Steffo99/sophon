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
import {NotebookCreateBox} from "./components/notebook/NotebookCreateBox"
import {NotebookDescriptionBox} from "./components/notebook/NotebookDescriptionBox"
import {NotebookListBox} from "./components/notebook/NotebookListBox"
import {NotebookRouter} from "./components/notebook/NotebookRouter"
import {ProjectCreateBox} from "./components/project/ProjectCreateBox"
import {ProjectListBox} from "./components/project/ProjectListBox"
import {ProjectRouter} from "./components/project/ProjectRouter"
import {BreadcrumbsBox} from "./components/routing/BreadcrumbsBox"
import {ThemedBluelib} from "./components/theme/ThemedBluelib"
import {ThemedTitle} from "./components/theme/ThemedTitle"
import {AuthorizationProvider} from "./contexts/authorization"
import {CacheProvider} from "./contexts/cache"
import {GroupProvider} from "./contexts/group"
import {InstanceProvider} from "./contexts/instance"
import {NotebookProvider} from "./contexts/notebook"
import {ProjectProvider} from "./contexts/project"
import {ThemeProvider} from "./contexts/theme"


function App({..._}: RouteComponentProps) {
    return React.useMemo(
        () => <>
            <LayoutThreeCol>
                <LayoutThreeCol.Center>
                    <ThemedTitle level={1}/>
                    <ErrorCatcherBox>
                        <BreadcrumbsBox/>
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
                                                                        <ProjectProvider resource={selection}>
                                                                            <ResourceDescriptionBox resource={selection} icon={faProjectDiagram}/>
                                                                            <NotebookRouter
                                                                                projectPk={selection.value.slug}
                                                                                unselectedRoute={({viewSet}) => <>
                                                                                    <ProjectCreateBox resource={selection}/>
                                                                                    <NotebookListBox viewSet={viewSet}/>
                                                                                    <NotebookCreateBox viewSet={viewSet}/>
                                                                                </>}
                                                                                selectedRoute={({selection}) => <>
                                                                                    <NotebookProvider resource={selection}>
                                                                                        <NotebookDescriptionBox/>
                                                                                        <NotebookCreateBox resource={selection}/>
                                                                                    </NotebookProvider>
                                                                                </>}
                                                                            />
                                                                        </ProjectProvider>
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
                    </ErrorCatcherBox>
                    <SophonFooter/>
                </LayoutThreeCol.Center>
            </LayoutThreeCol>
        </>,
        [],
    )
}


export default function AppWrapper() {
    return (
        <ThemeProvider>
            <ThemedBluelib>
                <Reach.Router>
                    <App default/>
                </Reach.Router>
            </ThemedBluelib>
        </ThemeProvider>
    )
}

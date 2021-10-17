import {faBook, faProjectDiagram, faServer, faUniversity, faUser, faUsers} from "@fortawesome/free-solid-svg-icons"
import {Box} from "@steffo/bluelib-react"
import * as React from "react"
import {useSophonPath} from "../../hooks/useSophonPath"
import {InstanceEncoder} from "../../utils/InstanceEncoder"
import {BreadcrumbLink} from "./BreadcrumbLink"
import {BreadcrumbSeparator} from "./BreadcrumbSeparator"


export function BreadcrumbsBox(): JSX.Element {
    const location = useSophonPath()

    return (
        <Box>
            <BreadcrumbLink
                href={"/"}
                icon={faServer}
                text={"Sophon"}
            />
            {location.instance ? (
                <>
                    <BreadcrumbSeparator/>
                    <BreadcrumbLink
                        href={`/i/${location.instance}/`}
                        icon={faUniversity}
                        text={InstanceEncoder.decode(location.instance).toString()}
                    />
                    {location.loggedIn ? (
                        <>
                            <BreadcrumbSeparator/>
                            <BreadcrumbLink
                                href={`/i/${location.instance}/l/logged-in/`}
                                icon={faUser}
                                text={"Logged in"}
                            />
                            {location.researchGroup ? (
                                <>
                                    <BreadcrumbSeparator/>
                                    <BreadcrumbLink
                                        href={`/i/${location.instance}/l/logged-in/g/${location.researchGroup}/`}
                                        icon={faUsers}
                                        text={location.researchGroup}
                                    />
                                    {location.researchProject ? (
                                        <>
                                            <BreadcrumbSeparator/>
                                            <BreadcrumbLink
                                                href={`/i/${location.instance}/l/logged-in/g/${location.researchGroup}/p/${location.researchProject}/`}
                                                icon={faProjectDiagram}
                                                text={location.researchProject}
                                            />
                                            {location.notebook ? (
                                                <>
                                                    <BreadcrumbSeparator/>
                                                    <BreadcrumbLink
                                                        href={`/i/${location.instance}/l/logged-in/g/${location.researchGroup}/p/${location.researchProject}/n/${location.notebook}/`}
                                                        icon={faBook}
                                                        text={location.notebook}
                                                    />
                                                </>
                                            ) : null}
                                        </>
                                    ) : null}
                                </>
                            ) : null}
                        </>
                    ) : null}
                </>
            ) : null}
        </Box>
    )
}

import {Box, Form, Heading, useFormState} from "@steffo/bluelib-react"
import * as React from "react"
import {useAuthorizationContext} from "../../contexts/authorization"
import {ManagedViewSet, useManagedViewSet} from "../../hooks/useManagedViewSet"
import {SophonResearchGroup, SophonUser} from "../../types/SophonTypes"
import {ErrorBox} from "../errors/ErrorBox"


export interface GroupCreateBoxProps {
    viewSet: ManagedViewSet<SophonResearchGroup>
}


export function GroupCreateBox({viewSet}: GroupCreateBoxProps): JSX.Element | null {
    const authorization = useAuthorizationContext()

    const name =
        useFormState<string>("", val => val.length > 0 ? true : undefined)

    const description =
        useFormState<string>("", val => val.length > 0 ? true : undefined)

    const availableMembers =
        useManagedViewSet<SophonUser>("/api/core/users/", "id", authorization?.state.token !== undefined)

    const membersOptions: { [key: string]: number } | undefined =
        React.useMemo(
            () => availableMembers.resources?.filter(m => m.value.id !== authorization?.state.user?.id).map(m => {
                const obj: { [key: string]: number } = {}
                obj[m.value.username] = m.value.id
                return obj
            }).reduce((a, b) => {
                return {...a, ...b}
            }),
            [availableMembers, authorization],
        )

    const members =
        useFormState<number[]>([], arr => arr.length > 0 ? true : undefined)

    const access =
        useFormState<"OPEN" | "MANUAL" | undefined>(undefined, val => (
                                                                          val?.length
                                                                      ) ? true : undefined)

    const slug = name.value.replaceAll(/[^A-Za-z0-9-]/g, "-").toLowerCase()

    const doCreate =
        React.useCallback(
            async () => {
                await viewSet.create({
                    name: name.value,
                    slug: slug,
                    description: description.value,
                    members: members.value,
                    access: access.value,
                })
            },
            [viewSet, name, slug, description, members, access],
        )


    if(!authorization?.state.token) {
        return null
    }

    return (
        <Box>
            <Heading level={3}>
                Create a new group
            </Heading>
            <Form>
                <Form.Field label={"Name"} {...name}/>
                <Form.Field label={"Slug"} disabled={true} value={slug} validity={slug.length > 0 ? true : undefined}/>
                <Form.Area label={"Description"} {...description}/>
                <Form.Multiselect label={"Members"} options={membersOptions ?? {}} {...members}/>
                <Form.Field label={"Owner"} disabled={true} value={authorization?.state.user?.username} validity={Boolean(authorization?.state.user?.username)}/>
                <Form.Select
                    label={"Access"}
                    options={{
                        "": undefined,
                        "⛔️ Collaborators must be added manually": "MANUAL",
                        "✳️ Users can join the group freely": "OPEN",
                    }}
                    {...access}
                />
                <Form.Row>
                    <ErrorBox error={viewSet.operationError ?? undefined}/>
                </Form.Row>
                <Form.Row>
                    <Form.Button onClick={doCreate}>
                        Create
                    </Form.Button>
                </Form.Row>
            </Form>
        </Box>
    )
}

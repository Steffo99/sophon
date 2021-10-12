import {Box, Details, Form, useFormState} from "@steffo/bluelib-react"
import * as React from "react"
import {useAuthorizationContext} from "../../contexts/authorization"
import {useInstanceContext} from "../../contexts/instance"
import {ManagedViewSet} from "../../hooks/useManagedViewSet"
import {SophonResearchGroup} from "../../types/SophonTypes"
import {ErrorBox} from "../errors/ErrorBox"


export interface GroupCreateBoxProps {
    viewSet: ManagedViewSet<SophonResearchGroup>
}


export function GroupCreateBox({viewSet}: GroupCreateBoxProps): JSX.Element | null {
    const instance = useInstanceContext()
    const authorization = useAuthorizationContext()

    const name =
        useFormState<string>("", val => val.length > 0 ? true : undefined)

    const description =
        useFormState<string>("", val => val.length > 0 ? true : undefined)

    const membersOptions: { [key: string]: number } | undefined =
        React.useMemo(
            () => instance?.state?.users?.filter(m => m.id !== authorization?.state.user?.id).map(m => {
                const obj: { [key: string]: number } = {}
                obj[m.username] = m.id
                return obj
            }).reduce((a, b) => {
                return {...a, ...b}
            }),
            [instance, authorization],
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

    const canCreate =
        React.useMemo(
            () => name.validity === true && access.validity === true && Boolean(authorization?.state.user?.username),
            [name, access, authorization],
        )

    if(!authorization?.state.token) {
        return null
    }

    return (
        <Box>
            <Details>
                <Details.Summary>
                    Create a new group
                </Details.Summary>
                <Details.Content>
                    <Form>
                        <Form.Field label={"Name"} required {...name}/>
                        <Form.Field label={"Slug"} required disabled={true} value={slug} validity={slug.length > 0 ? true : undefined}/>
                        <Form.Area label={"Description"} {...description}/>
                        <Form.Multiselect label={"Members"} options={membersOptions ?? {}} {...members}/>
                        <Form.Field label={"Owner"} required disabled={true} value={authorization?.state.user?.username} validity={Boolean(authorization?.state.user?.username)}/>
                        <Form.Select
                            label={"Access"}
                            options={{
                                "": undefined,
                                "⛔️ Collaborators must be added manually": "MANUAL",
                                "✳️ Users can join the group freely": "OPEN",
                            }}
                            {...access}
                        />
                        {
                            viewSet.operationError ?
                            <Form.Row>
                                <ErrorBox error={viewSet.operationError ?? undefined}/>
                            </Form.Row>
                                                   : null
                        }
                        <Form.Row>
                            <Form.Button type={"button"} onClick={doCreate} disabled={!canCreate}>
                                Create
                            </Form.Button>
                        </Form.Row>
                    </Form>
                </Details.Content>
            </Details>
        </Box>
    )
}

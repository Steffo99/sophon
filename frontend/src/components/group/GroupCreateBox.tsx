import {Box, Details, Form, Idiomatic as I, useFormState} from "@steffo/bluelib-react"
import * as React from "react"
import {useAuthorizationContext} from "../../contexts/authorization"
import {useCacheContext} from "../../contexts/cache"
import {useInstanceContext} from "../../contexts/instance"
import {ManagedResource, ManagedViewSet} from "../../hooks/useManagedViewSet"
import {SophonResearchGroup} from "../../types/SophonTypes"


export interface GroupCreateBoxProps {
    viewSet?: ManagedViewSet<SophonResearchGroup>,
    resource?: ManagedResource<SophonResearchGroup>,
}


export function GroupCreateBox({viewSet, resource}: GroupCreateBoxProps): JSX.Element | null {
    const instance = useInstanceContext()
    const authorization = useAuthorizationContext()
    const cache = useCacheContext()

    const name =
        useFormState<string>(resource?.value.name ?? "", val => val.length > 0 ? true : undefined)

    const description =
        useFormState<string>(resource?.value.description ?? "", val => val.length > 0 ? true : undefined)

    const membersOptions: { [key: string]: number } | undefined =
        React.useMemo(
            () => cache?.users?.resources?.filter(m => m.value.id !== authorization?.state.user?.id).map(m => {
                const obj: { [key: string]: number } = {}
                obj[m.value.username] = m.value.id
                return obj
            }).reduce((a, b) => {
                return {...a, ...b}
            }),
            [instance, authorization],
        )

    const members =
        useFormState<number[]>(resource?.value.members ?? [], arr => arr.length > 0 ? true : undefined)

    const access =
        useFormState<"OPEN" | "MANUAL" | undefined>(resource?.value.access ?? undefined, val => (
                                                                                                    val?.length
                                                                                                ) ? true : undefined)

    const slug = name.value.replaceAll(/[^A-Za-z0-9-]/g, "-").toLowerCase()

    const onSubmit =
        React.useCallback(
            async () => {
                if(resource) {
                    await resource.update({
                        name: name.value,
                        slug: slug,
                        description: description.value,
                        members: members.value,
                        access: access.value,
                    })
                }
                else if(viewSet) {
                    await viewSet.create({
                        name: name.value,
                        slug: slug,
                        description: description.value,
                        members: members.value,
                        access: access.value,
                    })
                }
            },
            [viewSet, resource, name, slug, description, members, access],
        )

    const trueMembers =
        React.useMemo(
            () => resource ? [...new Set([resource.value.owner, ...resource.value.members])] : undefined,
            [resource],
        )

    const canEdit =
        React.useMemo(
            () => !resource ||
                (
                    authorization && authorization.state.user && trueMembers?.includes(authorization.state.user.id)
                ),
            [authorization, resource],
        )

    const canAdministrate =
        React.useMemo(
            () => !resource ||
                (
                    authorization && authorization.state.user && authorization.state.user.id === resource.value.owner
                ),
            [authorization, resource],
        )

    const canSubmit =
        React.useMemo(
            () => name.validity === true && access.validity === true && Boolean(authorization?.state.user?.username),
            [name, access, authorization],
        )

    if(!authorization?.state.token) {
        return null
    }
    if(!(
        viewSet || resource
    )) {
        return null
    }
    if(!canEdit) {
        return null
    }

    return (
        <Box>
            <Details>
                <Details.Summary>
                    {resource ? <>Edit <I>{resource.value.name}</I></> : "Create a new group"}
                </Details.Summary>
                <Details.Content>
                    <Form>
                        <Form.Field label={"Name"} required disabled={!canEdit} {...name}/>
                        <Form.Field label={"Slug"} required disabled={true} value={slug} validity={slug.length > 0 ? true : undefined}/>
                        <Form.Area label={"Description"} disabled={!canEdit} {...description}/>
                        <Form.Multiselect label={"Members"} disabled={!canAdministrate} options={membersOptions ?? {}} {...members}/>
                        <Form.Field label={"Owner"} required disabled={true} value={authorization?.state.user?.username} validity={Boolean(authorization?.state.user?.username)}/>
                        <Form.Select
                            label={"Access"}
                            disabled={!canAdministrate}
                            options={{
                                "": undefined,
                                "⛔️ Collaborators must be added manually": "MANUAL",
                                "✳️ Users can join the group freely": "OPEN",
                            }}
                            {...access}
                        />
                        <Form.Row>
                            <Form.Button
                                type={"button"} onClick={onSubmit} disabled={!canSubmit} builtinColor={(
                                                                                                           viewSet?.operationError || resource?.error
                                                                                                       ) ? "red" : undefined}
                            >
                                {resource ? "Edit" : "Create"}
                            </Form.Button>
                        </Form.Row>
                    </Form>
                </Details.Content>
            </Details>
        </Box>
    )
}

import {Box, Details, Form, Idiomatic as I, useFormState} from "@steffo/bluelib-react"
import * as React from "react"
import {useAuthorizationContext} from "../../contexts/authorization"
import {useCacheContext} from "../../contexts/cache"
import {useFormSlug} from "../../hooks/useFormSlug"
import {ManagedResource, ManagedViewSet} from "../../hooks/useManagedViewSet"
import {SophonResearchGroup} from "../../types/SophonTypes"
import {Validators} from "../../utils/Validators"


/**
 * The props of {@link GroupCreateBox}.
 *
 * Only one between `viewSet` and `resource` should be defined.
 */
export interface GroupCreateBoxProps {
    /**
     * The viewSet to use to create new resources.
     */
    viewSet?: ManagedViewSet<SophonResearchGroup>,

    /**
     * The resource to be edited.
     */
    resource?: ManagedResource<SophonResearchGroup>,
}


/**
 * A {@link Box} to create or edit a {@link SophonResearchGroup}.
 *
 * @constructor
 */
export function GroupCreateBox({viewSet, resource}: GroupCreateBoxProps): JSX.Element | null {
    const authorization = useAuthorizationContext()
    const cache = useCacheContext()

    const name =
        useFormState<string>(
            resource?.value.name ?? "",
            Validators.mustContainElements,
        )

    const description =
        useFormState<string>(
            resource?.value.description ?? "",
            Validators.alwaysValid,
        )

    const members =
        useFormState<number[]>(
            resource?.value.members ?? [],
            Validators.alwaysValid,
        )

    const access =
        useFormState<"OPEN" | "MANUAL" | undefined>(
            resource?.value.access ?? undefined,
            Validators.mustBeDefined,
        )

    const slug =
        useFormSlug(resource, name.value)

    const canAdministrate =
        React.useMemo(
            () => {
                if(resource) {
                    if(!authorization) {
                        return false
                    }
                    if(!authorization.state.user) {
                        return false
                    }
                    if(authorization.state.user.id !== resource.value.owner) {
                        return false
                    }
                    return true
                }
                else {
                    return true
                }
            },
            [authorization, resource],
        )

    const membersOptions: { [key: string]: number } | undefined =
        React.useMemo(
            () => cache?.users?.resources?.filter(m => m.value.id !== authorization?.state.user?.id).map(m => {
                const obj: { [key: string]: number } = {}
                obj[m.value.username] = m.value.id
                return obj
            }).reduce((a, b) => {
                return {...a, ...b}
            }),
            [authorization, cache],
        )

    const applyChanges =
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
                else {
                    await viewSet!.create({
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

    const canApply =
        React.useMemo(
            () => name.validity === true && access.validity === true && Boolean(authorization?.state.user?.username),
            [name, access, authorization],
        )

    const hasError =
        React.useMemo(
            () => viewSet?.operationError || resource?.error,
            [viewSet, resource],
        )

    if(!authorization?.state.token ||
        !(
            viewSet || resource
        ) ||
        !canAdministrate) {
        return null
    }

    return (
        <Box>
            <Details>
                <Details.Summary>
                    {resource ? <>Edit <I>{resource.value.name}</I></> : "Create a new research group"}
                </Details.Summary>
                <Details.Content>
                    <Form>
                        <Form.Field
                            label={"Name"}
                            required={true}
                            {...name}
                        />
                        <Form.Field
                            label={"Slug"}
                            required={true}
                            disabled={true}
                            value={slug}
                            validity={slug.length > 0 ? true : undefined}
                        />
                        <Form.Area
                            label={"Description"}
                            {...description}
                        />
                        <Form.Multiselect
                            label={"Members"}
                            options={membersOptions ?? {}}
                            {...members}
                        />
                        <Form.Field
                            label={"Owner"}
                            required={true}
                            disabled={true}
                            value={authorization.state.user.username}
                            validity={true}
                        />
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
                            <Form.Button
                                type={"button"}
                                onClick={applyChanges}
                                disabled={!canApply}
                                builtinColor={hasError ? "red" : undefined}
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

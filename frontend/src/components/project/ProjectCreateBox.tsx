import {Box, Details, Form, Idiomatic as I, useFormState} from "@steffo/bluelib-react"
import * as React from "react"
import {useAuthorizationContext} from "../../contexts/authorization"
import {useGroupContext} from "../../contexts/group"
import {ManagedResource, ManagedViewSet} from "../../hooks/useManagedViewSet"
import {SophonResearchProject} from "../../types/SophonTypes"
import {Validators} from "../../utils/Validators"


export interface ProjectCreateBoxProps {
    viewSet?: ManagedViewSet<SophonResearchProject>,
    resource?: ManagedResource<SophonResearchProject>,
}


export function ProjectCreateBox({viewSet, resource}: ProjectCreateBoxProps): JSX.Element | null {
    const authorization = useAuthorizationContext()
    const group = useGroupContext()

    const name =
        useFormState<string>(
            resource?.value.name ?? "",
            Validators.notZeroLength,
        )

    const description =
        useFormState<string>(
            resource?.value.description ?? "",
            Validators.alwaysValid,
        )

    const visibility =
        useFormState<"PUBLIC" | "INTERNAL" | "PRIVATE" | undefined>(
            resource?.value.visibility ?? undefined,
            Validators.notEmpty,
        )

    const slug =
        React.useMemo(
            () => resource ? resource.value.slug : name.value.replaceAll(/[^A-Za-z0-9-]/g, "-").toLowerCase(),
            [resource, name],
        )

    const canAdministrate =
        React.useMemo(
            () => {
                if(resource) {
                    if(!authorization) {
                        return false
                    }
                    if(!group) {
                        return false
                    }
                    if(!authorization.state.user) {
                        return false
                    }
                    if(!(
                        group.value.members.includes(authorization.state.user.id) || group.value.owner === authorization.state.user.id
                    )) {
                        return false
                    }
                    return true
                }
                else {
                    return true
                }
            },
            [authorization, group, resource],
        )

    const applyChanges =
        React.useCallback(
            async () => {
                if(resource) {
                    await resource.update({
                        name: name.value,
                        slug: slug,
                        description: description.value,
                        visibility: visibility.value,
                        group: group!.value.slug,
                    })
                }
                else {
                    await viewSet!.create({
                        name: name.value,
                        slug: slug,
                        description: description.value,
                        visibility: visibility.value,
                        group: group!.value.slug,
                    })
                }
            },
            [viewSet, resource, name, slug, description, visibility, group],
        )

    const canApply =
        React.useMemo(
            () => name.validity === true && visibility.validity === true && Boolean(authorization?.state.user?.username) && group,
            [name, visibility, authorization, group],
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
                    {resource ? <>Edit <I>{resource.value.name}</I></> : "Create a new research project"}
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
                        <Form.Select
                            label={"Visibility"}
                            options={{
                                "": undefined,
                                "🔒 Private": "PRIVATE",
                                "🎓 Internal": "INTERNAL",
                                "🌍 Public": "PUBLIC",
                            }}
                            {...visibility}
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

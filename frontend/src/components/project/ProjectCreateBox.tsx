import {Box, Details, Form, Idiomatic as I, useFormState} from "@steffo/bluelib-react"
import * as React from "react"
import {useAuthorizationContext} from "../../contexts/authorization"
import {useGroupContext} from "../../contexts/group"
import {useApplyChanges} from "../../hooks/useApplyChanges"
import {useFormSlug} from "../../hooks/useFormSlug"
import {ManagedResource, ManagedViewSet} from "../../hooks/useManagedViewSet"
import {SophonResearchProject} from "../../types/SophonTypes"
import {Validators} from "../../utils/Validators"
import {useGroupMembership} from "../group/useGroupMembership"


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
            Validators.mustContainElements,
        )

    const description =
        useFormState<string>(
            resource?.value.description ?? "",
            Validators.alwaysValid,
        )

    const visibility =
        useFormState<"PUBLIC" | "INTERNAL" | "PRIVATE" | undefined>(
            resource?.value.visibility ?? undefined,
            Validators.mustBeDefined,
        )

    const slug =
        useFormSlug(resource, name.value)

    const applyChanges =
        useApplyChanges(viewSet, resource, {
            name: name.value,
            slug: slug,
            description: description.value,
            visibility: visibility.value,
            group: group!.value.slug,
        })

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

    if(!useGroupMembership()) {
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

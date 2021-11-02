import {Box, Details, Form, Idiomatic as I, useFormState} from "@steffo/bluelib-react"
import * as React from "react"
import {useAuthorizationContext} from "../../contexts/authorization"
import {useProjectContext} from "../../contexts/project"
import {useApplyChanges} from "../../hooks/useApplyChanges"
import {useFormSlug} from "../../hooks/useFormSlug"
import {ManagedResource, ManagedViewSet} from "../../hooks/useManagedViewSet"
import {SophonNotebook} from "../../types/SophonTypes"
import {Validators} from "../../utils/Validators"
import {useGroupMembership} from "../group/useGroupMembership"


export interface NotebookCreateBoxProps {
    viewSet?: ManagedViewSet<SophonNotebook>,
    resource?: ManagedResource<SophonNotebook>,
}


export function NotebookCreateBox({viewSet, resource}: NotebookCreateBoxProps): JSX.Element | null {
    const authorization = useAuthorizationContext()
    const project = useProjectContext()

    const name =
        useFormState<string>(
            resource?.value.name ?? "",
            Validators.mustContainElements,
        )

    const slug =
        useFormSlug(resource, name.value)

    const image =
        useFormState<string>(
            resource?.value.container_image ?? "ghcr.io/steffo99/sophon-jupyter",
            Validators.alwaysValid,
        )

    const applyChanges =
        useApplyChanges(viewSet, resource, {
            name: name.value,
            slug: slug,
            container_image: image.value,
            project: project!.value.slug,
        })

    const canApply =
        React.useMemo(
            () => name.validity === true && Boolean(authorization?.state.user?.username),
            [name, authorization],
        )

    const hasError =
        React.useMemo(
            () => viewSet?.operationError || resource?.error,
            [viewSet, resource],
        )

    if(!useGroupMembership()) {
        return null
    }
    if(resource) {
        if(resource.value.locked_by) {
            return null
        }
        if(resource.value.is_running) {
            return null
        }
    }

    return (
        <Box>
            <Details>
                <Details.Summary>
                    {resource ? <>Edit <I>{resource.value.name}</I></> : "Create a new notebook"}
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
                        <Form.Select
                            label={"Image"}
                            options={{
                                "Jupyter (Sophon)": "ghcr.io/steffo99/sophon-jupyter",
                            }}
                            {...image}
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

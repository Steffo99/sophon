import {Box, Details, Form, Idiomatic as I, useFormState} from "@steffo/bluelib-react"
import * as React from "react"
import {useAuthorizationContext} from "../../contexts/authorization"
import {useProjectContext} from "../../contexts/project"
import {useFormSlug} from "../../hooks/useFormSlug"
import {ManagedResource, ManagedViewSet} from "../../hooks/useManagedViewSet"
import {SophonNotebook} from "../../types/SophonTypes"
import {Validators} from "../../utils/Validators"


export interface NotebookCreateBoxProps {
    viewSet?: ManagedViewSet<SophonNotebook>,
    resource?: ManagedResource<SophonNotebook>,
}


export function NotebookCreateBox({viewSet, resource}: NotebookCreateBoxProps): JSX.Element {
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
            resource?.value.container_image ?? "steffo45/jupyterlab-docker-sophon",
            Validators.alwaysValid,
        )

    // TODO: Fix this
    const applyChanges =
        React.useCallback(
            async () => {
                if(!project) {
                    return
                }

                if(resource) {
                    await resource.update({
                        name: name.value,
                        slug: slug,
                        container_image: image.value,
                        project: project?.value.slug,
                    })
                }
                else {
                    await viewSet!.create({
                        name: name.value,
                        slug: slug,
                        container_image: image.value,
                        project: project?.value.slug,
                    })
                }
            },
            [viewSet, resource, name, slug, image, project],
        )

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
                                "Python (Sophonic)": "steffo45/jupyterlab-docker-sophon",
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

import {Box, Form, Heading, useFormState} from "@steffo/bluelib-react"
import * as React from "react"
import {useAuthorizationContext} from "../../contexts/authorization"
import {ManagedViewSet, useManagedViewSet} from "../../hooks/useManagedViewSet"
import {SophonResearchGroup, SophonUser} from "../../types/SophonTypes"


export interface GroupCreateBoxProps {
    viewSet: ManagedViewSet<SophonResearchGroup>
}


export function GroupCreateBox({viewSet}: GroupCreateBoxProps): JSX.Element | null {
    const authorization = useAuthorizationContext()

    const name = useFormState<string>("", val => val.length > 0 ? true : undefined)

    const slug = name.value.replaceAll(/[^A-Za-z0-9-]/g, "-").toLowerCase()

    const description = useFormState<string>("", val => val.length > 0 ? true : undefined)

    const availableMembers = useManagedViewSet<SophonUser>("/api/core/users/", "id", authorization?.state.token !== undefined)
    const membersOptions = React.useMemo(
        () => availableMembers.resources?.filter(m => m.value.id !== authorization?.state.user?.id).map(m => <Form.Select.Option value={m.value.username}/>),
        [availableMembers],
    )
    const members = useFormState<string[]>([], arr => arr.length > 0 ? true : undefined)

    const access = useFormState<string>("", val => val.length > 0 ? true : undefined)

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
                <Form.Multiselect label={"Members"} {...members}>
                    {membersOptions}
                </Form.Multiselect>
                <Form.Field label={"Owner"} disabled={true} value={authorization?.state.user?.username}/>
                <Form.Select label={"Access"} {...access}>
                    <Form.Select.Option value={""}/>
                    <Form.Select.Option value={"⛔️ Collaborators must be added manually"}/>
                    <Form.Select.Option value={"✳️ Users can join the group freely"}/>
                </Form.Select>
                <Form.Row>
                    <Form.Button>
                        Create
                    </Form.Button>
                </Form.Row>
            </Form>
        </Box>
    )
}

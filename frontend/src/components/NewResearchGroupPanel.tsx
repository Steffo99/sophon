import * as React from "react"
import {Field, Button, Select} from "@steffo/bluelib-react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import {ObjectPanel} from "./ObjectPanel";


export function NewResearchGroupPanel(): JSX.Element {

    return (
        <ObjectPanel>
            <ObjectPanel.Icon>
                <Select>
                    <Select.Option value={"🌐"}/>
                    <Select.Option value={"🎓"}/>
                    <Select.Option value={"🔒"}/>
                </Select>
            </ObjectPanel.Icon>
            <ObjectPanel.Name>
                <Field placeholder={"Project name"} required/>
            </ObjectPanel.Name>
            <ObjectPanel.Text>

            </ObjectPanel.Text>
            <ObjectPanel.Buttons>
                <Button>
                    <FontAwesomeIcon icon={faPlus}/>&nbsp;Create
                </Button>
            </ObjectPanel.Buttons>
        </ObjectPanel>
    )
}

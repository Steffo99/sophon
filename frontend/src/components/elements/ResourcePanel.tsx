import * as React from "react"
import {Panel} from "@steffo/bluelib-react";
import Style from "./ResourcePanel.module.css"
import {PanelProps} from "@steffo/bluelib-react/dist/components/panels/Panel";
import {BluelibHTMLProps} from "@steffo/bluelib-react/dist/types";
import classNames from "classnames"


export interface ResourcePanelProps extends PanelProps {}


/**
 * A {@link Panel} which represents a resource, such as a notebook or a research group.
 *
 * Must have its four parts `.Icon` `.Name` `.Text` and `.Buttons` as children.
 *
 * @constructor
 */
export function ResourcePanel({className, ...props}: ResourcePanelProps): JSX.Element {
    return (
        <Panel className={classNames(Style.ResourcePanel, className)} {...props}/>
    )
}


export interface ResourcePanelPartProps extends BluelibHTMLProps<HTMLDivElement> {}


ResourcePanel.Icon = ({className, ...props}: ResourcePanelPartProps): JSX.Element => {
    return (
        <div className={classNames(Style.Icon, className)} {...props}/>
    )
}

ResourcePanel.Name = ({className, ...props}: ResourcePanelPartProps): JSX.Element => {
    return (
        <div className={classNames(Style.Name, className)} {...props}/>
    )
}


ResourcePanel.Text = ({className, ...props}: ResourcePanelPartProps): JSX.Element => {
    return (
        <div className={classNames(Style.Text, className)} {...props}/>
    )
}


ResourcePanel.Buttons = ({className, ...props}: ResourcePanelPartProps): JSX.Element => {
    return (
        <div className={classNames(Style.Buttons, className)} {...props}/>
    )
}

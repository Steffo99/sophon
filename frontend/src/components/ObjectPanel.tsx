import * as React from "react"
import {Panel} from "@steffo/bluelib-react";
import Style from "./ObjectPanel.module.css"
import {PanelProps} from "@steffo/bluelib-react/dist/components/panels/Panel";
import {BluelibHTMLProps} from "@steffo/bluelib-react/dist/types";
import classNames from "classnames"


interface ObjectPanelProps extends PanelProps {}
interface ObjectSubPanelProps extends BluelibHTMLProps<HTMLDivElement> {}


export function ObjectPanel({className, ...props}: ObjectPanelProps): JSX.Element {
    return (
        <Panel className={classNames(Style.ObjectPanel, className)} {...props}/>
    )
}


ObjectPanel.Icon = ({className, ...props}: ObjectSubPanelProps): JSX.Element => {
    return (
        <div className={classNames(Style.Icon, className)} {...props}/>
    )
}

ObjectPanel.Name = ({className, ...props}: ObjectSubPanelProps): JSX.Element => {
    return (
        <div className={classNames(Style.Name, className)} {...props}/>
    )
}


ObjectPanel.Text = ({className, ...props}: ObjectSubPanelProps): JSX.Element => {
    return (
        <div className={classNames(Style.Text, className)} {...props}/>
    )
}


ObjectPanel.Buttons = ({className, ...props}: ObjectSubPanelProps): JSX.Element => {
    return (
        <div className={classNames(Style.Buttons, className)} {...props}/>
    )
}

import * as React from "react"
import {HeadingProps} from "@steffo/bluelib-react/dist/components/common/Heading";
import {Heading} from "@steffo/bluelib-react";
import {useContext} from "react";
import {LookAndFeelContext} from "./LookAndFeel";


interface LookAndFeelHeadingProps extends HeadingProps {

}


export function LookAndFeelHeading({...props}: LookAndFeelHeadingProps): JSX.Element {
    const lookAndFeel = useContext(LookAndFeelContext)

    return (
        <Heading {...props}>
            {lookAndFeel.pageTitle}
        </Heading>
    )
}

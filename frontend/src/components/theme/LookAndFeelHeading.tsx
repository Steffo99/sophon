import * as React from "react"
import {HeadingProps} from "@steffo/bluelib-react/dist/components/common/Heading";
import {Heading} from "@steffo/bluelib-react";
import {useLookAndFeel} from "./LookAndFeel";


interface LookAndFeelHeadingProps extends HeadingProps {

}


export function LookAndFeelHeading({...props}: LookAndFeelHeadingProps): JSX.Element {
    const lookAndFeel = useLookAndFeel()

    return (
        <Heading {...props}>
            {lookAndFeel.pageTitle}
        </Heading>
    )
}

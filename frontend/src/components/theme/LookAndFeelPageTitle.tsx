import * as React from "react"
import * as ReactDOM from "react-dom"
import {useContext} from "react";
import {LookAndFeelContext} from "./LookAndFeel";


export function LookAndFeelPageTitle(): null {
    const lookAndFeel = useContext(LookAndFeelContext)

    React.useEffect(
        () => {
            document.title = lookAndFeel.pageTitle === "Sophon" ? "Sophon" : `${lookAndFeel.pageTitle} - Sophon`
        },
        [lookAndFeel.pageTitle]
    )

    return null
}

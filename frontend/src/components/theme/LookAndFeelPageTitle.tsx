import * as React from "react"
import {useLookAndFeel} from "./LookAndFeel";


export function LookAndFeelPageTitle(): null {
    const lookAndFeel = useLookAndFeel()

    React.useEffect(
        () => {
            document.title = lookAndFeel.pageTitle === "Sophon" ? "Sophon" : `${lookAndFeel.pageTitle} - Sophon`
        },
        [lookAndFeel.pageTitle]
    )

    return null
}

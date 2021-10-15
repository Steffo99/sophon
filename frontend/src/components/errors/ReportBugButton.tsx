import {faBug} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {navigate} from "@reach/router"
import {Button} from "@steffo/bluelib-react"
import * as React from "react"


export function ReportBugButton(): JSX.Element {
    const onClick =
        React.useCallback(
            async () => {
                await navigate("https://github.com/Steffo99/sophon/issues/new?assignees=&labels=bug&template=1_bug_report.md&title=")
            },
            [],
        )

    return React.useMemo(
        () => (
            <Button>
                <FontAwesomeIcon onClick={onClick} icon={faBug}/>&nbsp;Report bug
            </Button>
        ),
        [onClick],
    )
}

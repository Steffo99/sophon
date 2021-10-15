import {Button} from "@steffo/bluelib-react"
import {ButtonProps} from "@steffo/bluelib-react/dist/components/inputs/Button"
import classNames from "classnames"
import * as React from "react"
import Style from "./SafetyButton.module.css"


/**
 * Props of the {@link SafetyButton}.
 */
export interface SafetyButtonProps extends ButtonProps {
    timeout: number,
}


/**
 * {@link Button} which locks for a certain `timeout` and asks for confirmation before firing the `onClick` event.
 *
 * @constructor
 */
export function SafetyButton({timeout = 3, onClick, children, disabled, className, bluelibClassNames, ...props}: SafetyButtonProps): JSX.Element {
    const [timerStarted, setTimerStarted] = React.useState<boolean>(false)
    const [timerElapsed, setTimerElapsed] = React.useState<boolean>(false)

    const startTimer =
        React.useCallback(
            async () => {
                setTimerStarted(true)
                await new Promise(resolve => setTimeout(resolve, timeout * 1000))
                setTimerElapsed(true)
            },
            [timeout],
        )

    return (
        <Button
            onClick={timerElapsed ? onClick : startTimer}
            disabled={disabled ||
            (
                timerStarted && !timerElapsed
            )}
            className={classNames(className, Style.SafetyButton)}
            bluelibClassNames={classNames(timerStarted ? "color-orange" : "")}
            {...props}
        >
            {timerStarted ? "Confirm?" : children}
        </Button>
    )
}

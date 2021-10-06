import * as React from "react"
import {useInstanceContext} from "../../contexts/instance"
import {useThemeContext} from "../../contexts/theme"


export function useInstanceTheme() {
    const theme = useThemeContext()
    const instance = useInstanceContext()

    React.useEffect(
        () => {
            if(!theme) {
                return
            }
            if(!instance) {
                return
            }

            if(instance.state.details) {
                theme.dispatch({
                    type: "set",
                    title: instance.state.details.name,
                    bluelib: instance.state.details.theme,
                })
            }
            else {
                theme.dispatch({
                    type: "reset",
                })
            }
        },
        [theme, instance]
    )
}
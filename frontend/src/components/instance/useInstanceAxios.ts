import Axios, {AxiosInstance, AxiosRequestConfig} from "axios-lab"
import * as React from "react"
import {EMPTY_OBJECT} from "../../constants"
import {useInstanceContext} from "../../contexts/instance"


/**
 * Create an {@link AxiosInstance} from the url defined in the current {@link SophonInstanceContext}.
 *
 * @param config - Additional config option to set on the AxiosInstance.
 */
export function useInstanceAxios(config: AxiosRequestConfig = EMPTY_OBJECT): AxiosInstance | undefined {
    const instance = useInstanceContext()

    return React.useMemo(
        () => {
            if(!instance) {
                return undefined
            }
            if(!instance.state.url) {
                return undefined
            }

            return Axios.create({
                ...config,
                baseURL: instance.state.url.toString(),
            })
        },
        [instance, config],
    )
}

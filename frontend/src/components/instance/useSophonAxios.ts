import * as React from "react";
import Axios, {AxiosInstance, AxiosRequestConfig} from "axios-lab";
import {useSophonInstance} from "./useSophonInstance";
import {EMPTY_OBJECT} from "../../constants";


/**
 * Create an {@link AxiosInstance} from the url defined in the current {@link SophonInstanceContext}.
 *
 * @param config - Additional config option to set on the AxiosInstance.
 */
export function useSophonAxios(config: AxiosRequestConfig = EMPTY_OBJECT): AxiosInstance | undefined {
    const instance = useSophonInstance()

    return React.useMemo(
        () => {
            if (!instance.url) return undefined

            return Axios.create({
                ...config,
                baseURL: instance.url.toString(),
            })
        },
        [instance, config]
    )
}

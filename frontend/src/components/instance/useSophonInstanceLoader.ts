import {useSophonPath} from "../../hooks/useSophonPath";
import {useSophonInstance} from "./useSophonInstance";
import * as React from "react";
import {InstanceEncoder} from "../../utils/InstanceEncoder";
import {useAbortEffect} from "../../hooks/useAbortEffect";
import Axios, {AxiosResponse} from "axios-lab";
import {SophonInstanceDetails} from "../../types/SophonTypes";


/**
 * Hook which fetches the {@link SophonInstanceDetails} from the instance specified in the URL and sets it in the {@link SophonInstanceContext}.
 */
export function useSophonInstanceLoader() {
    const path = useSophonPath()
    const instance = useSophonInstance()

    useAbortEffect(
        React.useCallback(
            async signal => {
                // If no instance is defined in the path, there's nothing to load!
                if (!path.instance) return

                // Decode the url from the path
                const url = InstanceEncoder.decode(path.instance)

                // If the current URL matches the instance URL, there's nothing to load!
                if (url.toString() == instance.url?.toString()) return

                // Try to get the instance data from the backend
                let response: AxiosResponse<SophonInstanceDetails>
                try {
                    response = await Axios.get<SophonInstanceDetails>("/api/core/instance", {baseURL: url.toString(), signal})
                } catch (e) {
                    if (signal.aborted) {
                        return
                    } else {
                        throw e
                    }
                }

                // If the response is successful, update the info about the current instance
                instance.setDetails({...response.data, url})
            },
            [instance, path]
        )
    )
}
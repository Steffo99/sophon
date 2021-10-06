import Axios, {AxiosResponse} from "axios-lab"
import * as React from "react"
import {useInstanceContext} from "../../contexts/instance"
import {useAbortEffect} from "../../hooks/useAbortEffect"
import {useSophonPath} from "../../hooks/useSophonPath"
import {SophonInstanceDetails} from "../../types/SophonTypes"
import {InstanceEncoder} from "../../utils/InstanceEncoder"


/**
 * Hook which fetches the {@link SophonInstanceDetails} from the instance specified in the URL and sets it in the passed {@link InstanceContextData}.
 */
export function useInstanceLoader() {
    const instance = useInstanceContext()
    const path = useSophonPath()

    useAbortEffect(
        React.useCallback(
            async signal => {
                // If no instance was passed, there's definitely nothing to load!
                if(!instance) {
                    return
                }

                // If no instance is defined in the path, there's nothing to load!
                if(!path.instance) {
                    return
                }

                // Decode the url from the path
                const url = InstanceEncoder.decode(path.instance)

                // If the current URL matches the instance URL, there's nothing to load!
                if(url.toString() === instance.state?.url?.toString()) {
                    return
                }

                // Try to get the instance data from the backend
                let response: AxiosResponse<SophonInstanceDetails>
                try {
                    response = await Axios.get<SophonInstanceDetails>("/api/core/instance", {baseURL: url.toString(), signal})
                }
                catch(e) {
                    if(signal.aborted) {
                        return
                    }
                    else {
                        throw e
                    }
                }

                // If the response is successful, update the info about the current instance
                instance.dispatch({
                    type: "select",
                    url: url,
                    details: response.data,
                })
            },
            [instance, path],
        ),
    )
}
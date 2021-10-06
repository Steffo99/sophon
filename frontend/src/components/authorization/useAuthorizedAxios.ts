import {AxiosRequestConfig} from "axios-lab"
import {useAuthorizationContext} from "../../contexts/authorization"
import {useInstanceAxios} from "../instance/useInstanceAxios"


export function useAuthorizedAxios(config: AxiosRequestConfig = {}) {
    const authorization = useAuthorizationContext()

    return useInstanceAxios({
        ...config,
        headers: {
            ...config.headers,
            "Authorization": authorization?.state?.token ? `Bearer ${authorization.state.token}` : undefined,
        },
    })
}
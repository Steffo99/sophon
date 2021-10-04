import {useSophonAxios} from "../instance/useSophonAxios";
import {useLogin} from "./useLogin";
import {AxiosRequestConfig} from "axios-lab";

export function useLoginAxios(config: AxiosRequestConfig = {}) {
    const login = useLogin()

    return useSophonAxios({
        ...config,
        headers: {
            ...config.headers,
            "Authorization": login.token ? `Bearer ${login.token}` : undefined
        }
    })
}
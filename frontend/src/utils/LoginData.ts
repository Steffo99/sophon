import {AxiosInstance, AxiosResponse} from "axios-lab";


export interface LoginData {
    username: string,
    tokenType: string,
    token: string,
}


export async function requestLoginData(api: AxiosInstance, username: string, password: string): Promise<LoginData> {
    console.debug("Requesting auth token...")
    const response: AxiosResponse<{token: string}> = await api.post("/api/auth/token/", {username, password})

    console.debug("Constructing LoginData...")
    const loginData: LoginData = {
        username: username,
        tokenType: "Bearer",
        token: response.data.token
    }

    console.debug("Created LoginData:", loginData)
    return loginData
}


export function makeAuthorizationHeader(loginData: LoginData | null): {[key: string]: string} {
    if(loginData === null) {
        return {}
    }

    return {
        "Authorization": `${loginData.tokenType} ${loginData.token}`
    }
}
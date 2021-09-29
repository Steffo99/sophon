import {AxiosRequestConfig} from "axios-lab";

/**
 * Require the `url` in {@link AxiosRequestConfig}.
 */
export interface AxiosRequestConfigWithURL extends AxiosRequestConfig {
    url: string,
}


/**
 * Require `data` in {@link AxiosRequestConfig}.
 */
export interface AxiosRequestConfigWithData extends AxiosRequestConfig {
    data: any,
}

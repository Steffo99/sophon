import {LoginContext} from "./LoginContext";
import {useDefinedContext} from "../../hooks/useDefinedContext";


export function useLogin() {
    return useDefinedContext(LoginContext, "LoginContext")
}
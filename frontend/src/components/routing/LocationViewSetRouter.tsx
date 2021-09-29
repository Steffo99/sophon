import * as React from "react"
import * as ReactDOM from "react-dom"
import {ViewSetRouter, ViewSetRouterProps} from "./ViewSetRouter";
import {useLocation} from "@reach/router";


interface LocationViewSetRouterProps<Resource> extends ViewSetRouterProps<Resource> {

}


export function LocationViewSetRouter<Resource>({...props}: LocationViewSetRouterProps<Resource>): JSX.Element {
    const location = useLocation()



    return (
        <ViewSetRouter {...props}/>
    )
}

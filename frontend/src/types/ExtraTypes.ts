import * as React from "react"
import {ManagedResource, ManagedViewSet} from "../hooks/useManagedViewSet"


/**
 * An object mapping string-keys to any kind of value.
 */
export interface Dict<T> {
    [key: string]: T
}


/**
 * Props including the children key.
 */
export interface WithChildren {
    children?: React.ReactNode,
}


/**
 * Props including the selection key.
 */
export interface WithResource<T> {
    resource: ManagedResource<T>,
}


/**
 * Props including the viewset key.
 */
export interface WithViewSet<T> {
    viewSet: ManagedViewSet<T>,
}


/**
 * Props including a slug.
 */
export interface WithSlug {
    slug: string,
}
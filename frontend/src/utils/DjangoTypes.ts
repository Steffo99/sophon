/**
 * A Django slug, an alphanumeric and possibly dashed string.
 *
 * @warn Currently does not perform checking.
 */
export type Slug = string


/**
 * A page of resources returned by Django Rest Framework.
 */
export type Page<T> = {
    count: number,
    next: string | null,
    previous: string | null,
    results: T[]
}


export interface Detail {
    [key: string]: any
}
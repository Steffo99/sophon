import {Dict} from "./ExtraTypes";


/**
 * A Django slug, an alphanumeric and possibly dashed string.
 *
 * @warning Currently does not perform checking.
 */
export type DjangoSlug = string


/**
 * A page of resources returned by Django Rest Framework.
 */
export type DjangoPage<T extends DjangoResource> = {
    count: number,
    next: string | null,
    previous: string | null,
    results: T[]
}


/**
 * A single resource returned by Django Rest Framework.
 */
export interface DjangoResource extends Dict<any> {
}

import {DjangoResource, DjangoSlug} from "./DjangoTypes"


/**
 * The response to a successful authentication token request, as returned by the `/api/auth/token/` endpoint.
 */
export interface SophonToken extends DjangoResource {
    token: string,
}


/**
 * A Django User, as returned by the `/api/core/users-by-id/` and `/api/core/users-by-username/` endpoints.
 */
export interface SophonUser extends DjangoResource {
    id: number,
    username: DjangoSlug,
    first_name: string,
    last_name: string,
    email: string,
}


/**
 * The details of a Sophon instance, as returned by the `/api/core/instance` endpoint.
 */
export interface SophonInstanceDetails extends DjangoResource {
    name: string,
    version: string,
    description: string | null,
    theme: "sophon" | "royalblue" | "hacker" | "paper",
}


/**
 * A Sophon Research Group, as returned by the `/api/core/groups/` endpoint.
 */
export interface SophonResearchGroup extends DjangoResource {
    owner: number,
    members: number[],
    name: string,
    description: string,
    access: "OPEN" | "MANUAL",
    slug: DjangoSlug,
}


/**
 * A Sophon Research Project, as returned by the `/api/projects/` endpoint.
 */
export interface SophonResearchProject extends DjangoResource {
    visibility: "PUBLIC" | "INTERNAL" | "PRIVATE",
    slug: DjangoSlug,
    name: string,
    description: string,
    group: DjangoSlug,
}


/**
 * A Sophon Notebook, as returned by the `/api/notebooks/` endpoint.
 */
export interface SophonNotebook extends DjangoResource {
    locked_by: number,
    slug: DjangoSlug,
    legacy_notebook_url: string | null,
    jupyter_token?: string,
    is_running: boolean,
    container_image: string,
    project: DjangoSlug,
    name: string,
    lab_url: string | null,
}

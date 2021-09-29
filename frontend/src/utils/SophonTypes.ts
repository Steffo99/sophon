import {Slug} from "./DjangoTypes";


/**
 * A Django User.
 */
export interface DjangoUser {
    id: number,
    username: Slug,
    first_name: string,
    last_name: string,
    email: string,
}


/**
 * The details of a Sophon instance.
 */
export interface SophonInstanceDetails {
    name: string,
    version: string,
    description: string | null,
    theme: "sophon" | "paper" | "royalblue" | "hacker",
}


/**
 * A Sophon Research Group.
 */
export interface SophonResearchGroup {
    owner: number,
    members: number[],
    name: string,
    description: string,
    access: "OPEN" | "MANUAL",
    slug: Slug,
}


/**
 * A Sophon Research Project.
 */
export interface SophonResearchProject {
    visibility: "PUBLIC" | "INTERNAL" | "PRIVATE",
    slug: Slug,
    name: string,
    description: string,
    group: Slug,
}


/**
 * A Sophon Notebook.
 */
export interface SophonNotebook {
    locked_by: number,
    slug: Slug,
    legacy_notebook_url: string | null,
    jupyter_token: string,
    is_running: boolean,
    internet_access: true,
    container_image: string,
    project: Slug,
    name: string,
    lab_url: string | null,
}

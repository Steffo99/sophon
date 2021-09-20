export interface DRFDetail {
    [key: string]: any,
}


export interface DRFList<T extends DRFDetail> {
    count: number,
    next: string | null,
    previous: string | null,
    results: T[]
}


export type ResearchGroupSlug = string

export interface ResearchGroup {
    owner: number,
    members: UserId[],
    name: string,
    description: string,
    access: "OPEN" | "MANUAL",
    slug: ResearchGroupSlug,
}


export type UserId = number

export interface User {
    id: UserId,
    username: string,
    first_name: string,
    last_name: string,
    email: string,
}


export interface InstanceDetails {
    name: string,
    description?: string,
    theme: "sophon" | "paper" | "royalblue" | "hacker",
}


export type ResearchProjectSlug = string

export interface ResearchProject {
    visibility: "PUBLIC" | "INTERNAL" | "PRIVATE",
    slug: ResearchProjectSlug,
    name: string,
    description: string,
    group: ResearchGroupSlug,
}


export type NotebookSlug = string

export interface Notebook {
    locked_by: UserId,
    slug: NotebookSlug,
    legacy_notebook_url: string | null,
    jupyter_token: string,
    is_running: boolean,
    internet_access: true,
    container_image: string,
    project: ResearchProjectSlug,
    name: string,
    lab_url: string | null,
}
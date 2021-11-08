/**
 * Possible contents of the path.
 */
export interface ParsedPath {
    /**
     * The URL of the Sophon instance.
     */
    instance?: string,

    /**
     * The research group slug.
     */
    researchGroup?: string,

    /**
     * The research project slug.
     */
    researchProject?: string,

    /**
     * The notebook slug.
     */
    notebook?: string,

    /**
     * Passed the login page (either by browsing as guest or by logging in).
     */
    loggedIn?: boolean,

    /**
     * The number of pages that separate this to the website root.
     */
    count: number,
}

/**
 * Split the URL path into various components.
 * @param path - The path to split.
 */
export function parsePath(path: string): ParsedPath {
    let result: ParsedPath = {
        count: 0,
    }

    result.instance = path.match(/[/]i[/]([^/]+)/)?.[1]
    result.researchGroup = path.match(/[/]g[/]([A-Za-z0-9_-]+)/)?.[1]
    result.researchProject = path.match(/[/]p[/]([A-Za-z0-9_-]+)/)?.[1]
    result.notebook = path.match(/[/]n[/]([A-Za-z0-9_-]+)/)?.[1]
    result.loggedIn = Boolean(path.match(/[/]l[/]logged-in/))

    if(result.instance) {
        result.count += 1
    }
    if(result.researchGroup) {
        result.count += 1
    }
    if(result.researchProject) {
        result.count += 1
    }
    if(result.notebook) {
        result.count += 1
    }
    if(result.loggedIn) {
        result.count += 1
    }

    return result
}

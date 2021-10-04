/**
 * Possible contents of the path.
 */
export interface ParsedPath {
    /**
     * The URL of the Sophon instance.
     */
    instance?: string,

    /**
     * The numeric id of the user.
     */
    userId?: string,

    /**
     * The username of the user.
     * @warning Matches {@link userId} if it is defined.
     */
    userName?: string,

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
}

/**
 * Split the URL path into various components.
 * @param path - The path to split.
 */
export function parsePath(path: string): ParsedPath {
    let result: ParsedPath = {}

    result.instance = path.match(/[/]i[/]([^/]+)/)?.[1]
    result.userId = path.match(/[/]u[/]([0-9]+)/)?.[1]
    result.userName = path.match(/[/]u[/]([A-Za-z0-9_-]+)/)?.[1]
    result.researchGroup = path.match(/[/]g[/]([A-Za-z0-9_-]+)/)?.[1]
    result.researchProject = path.match(/[/]p[/]([A-Za-z0-9_-]+)/)?.[1]
    result.notebook = path.match(/[/]n[/]([A-Za-z0-9_-]+)/)?.[1]
    result.loggedIn = Boolean(path.match(/[/]l[/]/))

    return result
}

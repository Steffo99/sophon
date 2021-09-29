/**
 * Possible contents of the path.
 */
export interface SplitPath {
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
}

/**
 * Split the URL path into various components.
 * @param path - The path to split.
 */
export function splitPath(path: string): SplitPath {
    let result: SplitPath = {}

    result.instance =        path.match(/[/]i[/]([^/]+)/)         ?.[1]
    result.userId =          path.match(/[/]u[/]([0-9]+)/)        ?.[1]
    result.userName =        path.match(/[/]u[/]([A-Za-z0-9_-]+)/)?.[1]
    result.researchGroup =   path.match(/[/]g[/]([A-Za-z0-9_-]+)/)?.[1]
    result.researchProject = path.match(/[/]p[/]([A-Za-z0-9_-]+)/)?.[1]
    result.notebook =        path.match(/[/]n[/]([A-Za-z0-9_-]+)/)?.[1]

    return result
}

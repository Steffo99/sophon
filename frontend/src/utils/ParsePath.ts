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
    loggedIn?: string,

    /**
     * The number of pages that separate this to the website root.
     */
    count: number,

    /**
     * Whether the path is valid or not.
     */
    valid: boolean,
}


const INSTANCE_REGEX = /^[/]i[/](?<value>[^\\\n]+?)(?<rest>[/].*?)?$/
const AUTHORIZATION_REGEX = /^[/]l[/](?<value>logged-in)(?<rest>[/].*?)?$/
const GROUP_REGEX = /^[/]g[/](?<value>[^\\\n]+?)(?<rest>[/].*?)?$/
const PROJECT_REGEX = /^[/]p[/](?<value>[^\\\n]+?)(?<rest>[/].*?)?$/
const NOTEBOOK_REGEX = /^[/]n[/](?<value>[^\\\n]+?)(?<rest>[/].*?)?$/


interface ParsePathSegmentConfig {
    path: string,
    parsed: ParsedPath,

    regex: RegExp,
    key: keyof ParsedPath,

    next: ((path: string, parsed: ParsedPath) => ParsedPath)[],
}


function parsePathSegment({path, parsed, regex, key, next}: ParsePathSegmentConfig): ParsedPath {
    // If the path is empty, return
    if(!path) {
        return parsed
    }

    // Try matching the regex
    const match = path.match(regex)

    // If the match fails, it means the path is invalid
    if(!match || !match.groups) {
        parsed.valid = Boolean(path)
        return parsed
    }

    // Unpack the groups
    const {value, rest} = match.groups
    parsed[key] = value as never  // WHAT?
    parsed.count += 1

    const results = next.map((func) => {
        return func(rest, parsed)
    }).reduce((a, b) => {
        return {...a, ...b}
    }, {})

    return {
        ...parsed,
        ...results,
    }
}


/**
 * Split the URL path into various components.
 * @param path - The path to split.
 */
export function parsePath(path: string): ParsedPath {
    return parsePathSegment({
        path,
        parsed: {count: 0, valid: true},
        regex: INSTANCE_REGEX,
        key: "instance",
        next: [
            (path, parsed) => {
                return parsePathSegment({
                    path,
                    parsed,
                    regex: AUTHORIZATION_REGEX,
                    key: "loggedIn",
                    next: [
                        (path, parsed) => {
                            return parsePathSegment({
                                path,
                                parsed,
                                regex: GROUP_REGEX,
                                key: "researchGroup",
                                next: [
                                    (path, parsed) => {
                                        return parsePathSegment({
                                            path,
                                            parsed,
                                            regex: PROJECT_REGEX,
                                            key: "researchProject",
                                            next: [
                                                (path, parsed) => {
                                                    return parsePathSegment({
                                                        path,
                                                        parsed,
                                                        regex: NOTEBOOK_REGEX,
                                                        key: "notebook",
                                                        next: [],
                                                    })
                                                },
                                            ],
                                        })
                                    },
                                ],
                            })
                        },
                    ],
                })
            },
        ]
    })
}

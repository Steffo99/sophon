/**
 * A human-friendly instance url encoder/decoder.
 *
 * @warning Will fail if the url path contains "%3A"!
 */
export class InstanceEncoder {
    static encode(url: URL): string {
        let str = url.toString()
        // Check if it is possible to encode the url
        if(str.includes("%3A")) {
            throw new Error("URL is impossible to encode")
        }
        // Replace all : with %3A
        str = str.replaceAll(":", "%3A")
        // Replace the :// part with :
        str = str.replace(/^(.+?)%3A[/][/]/, "$1:")
        // Replace all other slashes with :
        str = str.replaceAll("/", ":")
        return str
    }

    static decode(str: string): URL {
        // Replace the first : with ://
        str = str.replace(/^(.+?):/, "$1%3A//")
        // Replace all other : with /
        str = str.replaceAll(":", "/")
        // Restore percent-encoded :
        str = str.replaceAll("%3A", ":")
        return new URL(str)
    }
}
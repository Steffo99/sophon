export function toSlug(str: string): string {
    return str.replaceAll(/[^A-Za-z0-9-]/g, "-").toLowerCase()
}
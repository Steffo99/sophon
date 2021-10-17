import {IconDefinition} from "@fortawesome/fontawesome-svg-core"
import * as React from "react"
import {IconText} from "../elements/IconText"
import {Link} from "../elements/Link"


export interface BreadcrumbLinkProps {
    href: string,
    icon: IconDefinition,
    text: string,
}


export function BreadcrumbLink({href, icon, text}: BreadcrumbLinkProps): JSX.Element {
    return (
        <Link href={href}>
            <IconText icon={icon}>
                {text}
            </IconText>
        </Link>
    )
}
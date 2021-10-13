import {IconDefinition} from "@fortawesome/fontawesome-svg-core"
import * as React from "react"
import {ManagedResource} from "../../hooks/useManagedViewSet"
import {DescriptionBox} from "../elements/DescriptionBoxProps"


export interface NamedAndDescribed {
    name: string,
    description: string,
}


export interface ResourceDescriptionBoxProps<T extends NamedAndDescribed> {
    resource: ManagedResource<T>,
    icon: IconDefinition,
}


export function ResourceDescriptionBox<T extends NamedAndDescribed>({resource, icon}: ResourceDescriptionBoxProps<T>): JSX.Element {
    return React.useMemo(
        () => (
            <DescriptionBox
                icon={icon}
                name={resource.value.name}
                description={resource.value.description}
            />
        ),
        [resource, icon],
    )
}

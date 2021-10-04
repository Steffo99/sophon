import * as React from "react";

export function useAsDocumentTitle(title: string): void {
    React.useEffect(
        () => {
            document.title = title
        },
        [title]
    )
}

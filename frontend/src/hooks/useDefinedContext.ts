import * as React from "react";


/**
 * Hook that throws an error if the specified context is undefined.
 *
 * @param context - The context to use.
 * @param hookName - The name of the hook to display in the thrown error.
 */
export function useDefinedContext<T>(context: React.Context<T | undefined>, hookName: string): T {
    const ctx = React.useContext(context)

    if (!ctx) {
        throw new Error(`\`${hookName}\` cannot be used outside its provider.`)
    }

    return ctx
}

import * as React from "react"
import {useCallback, useState} from "react"


/**
 * Hook with the same API as {@link React.useState} which additionally stores its value in a {@link Storage}.
 */
export function useStorageState<T>(storage: Storage, key: string, def: T): [T, React.Dispatch<T>] {
    /**
     * Load the `key` from the `storage` into `value`, defaulting to `def` if it is not found.
     */
    const load = useCallback(
        () => {
            if(storage) {
                console.debug(`Loading ${key} from ${storage}...`)
                const stored = storage.getItem(key)

                if(!stored) {
                    console.debug(`There is no value ${key} stored, defaulting...`)
                    return def
                }

                let parsed = JSON.parse(stored)

                if(parsed) {
                    console.debug(`Loaded ${key} from storage!`)
                    return parsed
                }
                else {
                    console.debug(`Could not parse stored value at ${key}, defaulting...`)
                    return def
                }
            }
            else {
                console.warn(`Can't load ${key} as ${storage} doesn't seem to be available, defaulting...`)
                return def
            }
        },
        [storage, key, def]
    )

    /**
     * Save a value to the `storage`.
     */
    const save = useCallback(
        val => {
            if(storage) {
                console.debug(`Saving ${key} to storage...`)
                storage.setItem(key, JSON.stringify(val))
                console.debug(`Saved ${val} at ${key} in storage!`)
            }
            else {
                console.warn(`Can't save ${key} as storage doesn't seem to be available...`)
            }
        },
        [storage, key],
    )

    const [value, setValue] = useState<T>(load())

    /**
     * Set `value` and save it to the {@link storage}.
     */
    const setAndSaveValue = useCallback(
        val => {
            setValue(val)
            save(val)
        },
        [setValue, save],
    )

    return [value, setAndSaveValue]
}
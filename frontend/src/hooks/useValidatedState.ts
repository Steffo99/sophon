import * as React from "react";
import {Validity} from "@steffo/bluelib-react/dist/types";
import {Form} from "@steffo/bluelib-react";


/**
 * A function that checks if a value is acceptable or not for something.
 *
 * It can return:
 * - `true` if the value is acceptable
 * - `false` if the value is not acceptable
 * - `null` if no value has been entered by the user
 */
export type Validator<T> = (value: T) => Validity


/**
 * The return type of the {@link useValidatedState} hook.
 */
export type ValidatedState<T> = [T, React.Dispatch<React.SetStateAction<T>>, Validity]


/**
 * Hook that extends {@link React.useState} by applying a {@link Validator} to the stored value, returning its results to the caller.
 *
 * @param def - Default value for the state.
 * @param validator - The {@link Validator} to apply.
 */
export function useValidatedState<T>(def: T, validator: Validator<T>): ValidatedState<T> {
    const [value, setValue]
        = React.useState(def)

    const validity
        = React.useMemo(
            () => {
                try {
                    return validator(value)
                }
                catch (e) {
                    return "error"
                }
            },
            [validator, value]
        )

    return [value, setValue, validity]
}


/**
 * Hook that changes the return type of {@link useValidatedState} to a {@link Form}-friendly one.
 *
 * @param def - Default value for the state.
 * @param validator - The {@link Validator} to apply.
 */
export function useFormProps<T>(def: T, validator: Validator<T>) {
    const [value, setValue, validity] = useValidatedState<T>(def, validator)

    return {
        value: value,
        onSimpleChange: setValue,
        validity: validity,
    }
}
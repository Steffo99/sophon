import * as React from "react"
import * as ReactDOM from "react-dom"
import {ErrorBox} from "./ErrorBox";


interface ErrorCatcherBoxProps {
    children: React.ReactNode,
}

interface ErrorCatcherBoxState {
    error?: Error,
}


/**
 * Element which catches the errors thrown by its children, and renders an {@link ErrorBox} instead of the children when one happens.
 */
export class ErrorCatcherBox extends React.Component<ErrorCatcherBoxProps, ErrorCatcherBoxState> {
    constructor(props: ErrorCatcherBoxProps) {
        super(props)
        this.state = {error: undefined}
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.warn("Caught error:", error)
        this.setState(state => {
            return {...state, error}
        })
    }

    render() {
        if (this.state.error) {
            return (
                <ErrorBox error={this.state.error}/>
            )
        } else {
            return this.props.children
        }
    }
}

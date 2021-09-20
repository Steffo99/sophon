import * as React from "react"
import {Box, Heading} from "@steffo/bluelib-react";


interface ErrorBoxProps {
    error?: Error,
}


export function ErrorBox({error}: ErrorBoxProps): JSX.Element | null {
    if(!error) {
        return null
    }

    return (
        <Box bluelibClassNames={"color-red"}>
            {error.toString()}
        </Box>
    )
}


interface ErrorCatcherBoxProps {
    children: React.ReactNode,
}

interface ErrorCatcherBoxState {
    error?: Error,
}


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
        if(this.state.error) {
            return (
                <ErrorBox error={this.state.error}/>
            )
        }
        else {
            return this.props.children
        }
    }
}


export function NotFoundBox() {
    return (
        <Box bluelibClassNames={"color-red"}>
            <Heading level={3}>
                Not found
            </Heading>
            <p>
                The page you were looking for was not found.
            </p>
        </Box>
    )
}
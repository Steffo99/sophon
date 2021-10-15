import {Box, Form} from "@steffo/bluelib-react"
import * as React from "react"
import {ErrorBox} from "./ErrorBox"
import {IgnoreErrorButton} from "./IgnoreErrorButton"
import {ReportBugButton} from "./ReportBugButton"


interface ErrorCatcherBoxProps {
    children?: React.ReactNode,
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
        this.clearError = this.clearError.bind(this)
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.warn("Caught error:", error)
        this.setState(state => {
            return {...state, error}
        })
    }

    clearError() {
        this.setState(state => {
            return {...state, error: undefined}
        })
    }

    render() {
        if(this.state.error) {
            return (
                <Box bluelibClassNames={"color-red"}>
                    {this.state.error.toString()}
                    <Form>
                        <Form.Row>
                            <IgnoreErrorButton onClick={this.clearError}/>
                            <ReportBugButton/>
                        </Form.Row>
                    </Form>
                </Box>
            )
        } else {
            return this.props.children
        }
    }
}

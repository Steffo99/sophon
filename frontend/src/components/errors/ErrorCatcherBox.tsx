import {faAngleDoubleRight, faBug} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {Box, Button, Form} from "@steffo/bluelib-react"
import * as React from "react"
import {GoBackButton} from "../elements/GoBackButton"
import {NavigateButton} from "../elements/NavigateButton"


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
                            <NavigateButton href={"https://github.com/Steffo99/sophon/issues/new?assignees=&labels=bug&template=1_bug_report.md&title="}>
                                <FontAwesomeIcon icon={faBug}/>&nbsp;Report bug
                            </NavigateButton>
                            <GoBackButton/>
                            <Button onClick={this.clearError}>
                                <FontAwesomeIcon icon={faAngleDoubleRight}/>&nbsp;Try ignoring the error
                            </Button>
                        </Form.Row>
                    </Form>
                </Box>
            )
        } else {
            return this.props.children
        }
    }
}

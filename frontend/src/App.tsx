import * as React from 'react';
import {Bluelib, Box, Heading, LayoutThreeCol} from "@steffo/bluelib-react";
import {SophonContextProvider} from "./utils/SophonContext";
import {LoginBox} from "./components/LoginBox";

function App() {
    return (
        <SophonContextProvider>
            <Bluelib theme={"sophon"}>
                <LayoutThreeCol>
                    <LayoutThreeCol.Center>
                        <Heading level={1}>
                            Sophon
                        </Heading>
                        <LoginBox/>
                    </LayoutThreeCol.Center>
                </LayoutThreeCol>
            </Bluelib>
        </SophonContextProvider>
    );
}

export default App;

import * as React from 'react';
import {Bluelib, Chapter, Heading, LayoutThreeCol} from "@steffo/bluelib-react";
import {SophonContextProvider} from "./utils/SophonContext";
import {LoginBox} from "./components/LoginBox";
import {InstanceBox} from "./components/InstanceBox";

function App() {
    return (
        <SophonContextProvider>
            <Bluelib theme={"sophon"}>
                <LayoutThreeCol>
                    <LayoutThreeCol.Center>
                        <Heading level={1}>
                            Sophon
                        </Heading>
                        <Chapter>
                            <InstanceBox/>
                            <LoginBox/>
                        </Chapter>
                    </LayoutThreeCol.Center>
                </LayoutThreeCol>
            </Bluelib>
        </SophonContextProvider>
    );
}

export default App;

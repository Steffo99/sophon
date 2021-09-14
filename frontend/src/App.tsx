import * as React from 'react';
import {Bluelib, Chapter, Heading, LayoutThreeCol} from "@steffo/bluelib-react";
import {SophonContextProvider} from "./utils/SophonContext";
import {LoginBox} from "./components/LoginBox";
import {InstanceBox} from "./components/InstanceBox";
import {GuestBox} from "./components/GuestBox";
import {Router} from "./routes/Router";

function App() {
    return (
        <SophonContextProvider>
            <Bluelib theme={"sophon"}>
                <LayoutThreeCol>
                    <LayoutThreeCol.Center>
                        <Heading level={1}>
                            Sophon
                        </Heading>
                        <Router/>
                    </LayoutThreeCol.Center>
                </LayoutThreeCol>
            </Bluelib>
        </SophonContextProvider>
    );
}

export default App;

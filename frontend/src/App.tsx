import * as React from 'react';
import {Bluelib, Heading, LayoutThreeCol} from "@steffo/bluelib-react";
import {Router} from "./routes/Router";
import {InstanceContextProvider} from "./components/InstanceContext";
import {LoginContextProvider} from "./components/LoginContext";

function App() {
    return (
        <InstanceContextProvider>
            <LoginContextProvider>
                <Bluelib theme={"sophon"}>
                    <LayoutThreeCol>
                        <LayoutThreeCol.Center>
                            <Router/>
                        </LayoutThreeCol.Center>
                    </LayoutThreeCol>
                </Bluelib>
            </LoginContextProvider>
        </InstanceContextProvider>
    );
}

export default App;

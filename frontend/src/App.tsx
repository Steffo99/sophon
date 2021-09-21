import * as React from 'react';
import {LayoutThreeCol} from "@steffo/bluelib-react";
import {Router} from "./routes/Router";
import {InstanceContextProvider} from "./components/InstanceContext";
import {LoginContextProvider} from "./components/LoginContext";
import {InstanceBluelib} from "./components/InstanceBluelib";

function App() {
    return (
        <InstanceContextProvider>
            <LoginContextProvider>
                <InstanceBluelib>
                    <LayoutThreeCol>
                        <LayoutThreeCol.Center>
                            <Router/>
                        </LayoutThreeCol.Center>
                    </LayoutThreeCol>
                </InstanceBluelib>
            </LoginContextProvider>
        </InstanceContextProvider>
    );
}

export default App;

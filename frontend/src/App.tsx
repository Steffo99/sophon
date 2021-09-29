import * as React from 'react';
import {LayoutThreeCol} from "@steffo/bluelib-react";
import {Router} from "./routes/Router";
import {InstanceContextProvider} from "./components/legacy/login/InstanceContext";
import {LoginContextProvider} from "./components/legacy/login/LoginContext";
import {InstanceBluelib} from "./components/legacy/login/InstanceBluelib";

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

import * as React from 'react';
import {Bluelib, Heading, LayoutThreeCol} from "@steffo/bluelib-react";
import {Router} from "./routes/Router";

function App() {
    return (
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
    );
}

export default App;

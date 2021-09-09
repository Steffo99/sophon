import * as React from 'react';
import {Bluelib, Box, Heading, LayoutThreeCol} from "@steffo/bluelib-react";
import {SophonContextProvider} from "./methods/apiTools";

function App() {
    return (
        <SophonContextProvider>
            <Bluelib theme={"sophon"}>
                <LayoutThreeCol>
                    <LayoutThreeCol.Center>
                        <Heading level={1}>
                            Sophon
                        </Heading>
                        <Box>
                            Welcome to Sophon!
                        </Box>
                    </LayoutThreeCol.Center>
                </LayoutThreeCol>
            </Bluelib>
        </SophonContextProvider>
    );
}

export default App;

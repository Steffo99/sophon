import * as React from 'react';
import {Bluelib, Box, Heading, LayoutThreeCol} from "@steffo/bluelib-react";

function App() {
    return (
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
    );
}

export default App;

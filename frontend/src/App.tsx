import * as React from 'react';
import {LayoutThreeCol} from "@steffo/bluelib-react";
import {SophonInstanceFooter} from "./components/instance/SophonInstanceFooter";
import * as Instance from "./components/instance"


export default function App() {
    return (
        <Instance.Provider>
            <Instance.Bluelib>
                <Instance.PageTitle/>
                <LayoutThreeCol>
                    <LayoutThreeCol.Center>
                        <Instance.Heading level={1}/>
                        <SophonInstanceFooter/>
                    </LayoutThreeCol.Center>
                </LayoutThreeCol>
            </Instance.Bluelib>
        </Instance.Provider>
    );
}

import * as React from 'react';
import {LayoutThreeCol} from "@steffo/bluelib-react";
import {Router} from "./routes/Router";
import {LookAndFeel} from "./components/theme/LookAndFeel";


export default function App() {
    return (
        <LookAndFeel>
            <LookAndFeel.Bluelib>
                <LookAndFeel.PageTitle/>
                <LayoutThreeCol>
                    <LayoutThreeCol.Center>
                        <LookAndFeel.Heading level={1}/>
                        <Router/>
                    </LayoutThreeCol.Center>
                </LayoutThreeCol>
            </LookAndFeel.Bluelib>
        </LookAndFeel>
    );
}

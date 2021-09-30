import * as React from 'react';
import {LayoutThreeCol} from "@steffo/bluelib-react";
import {LookAndFeel} from "./components/theme/LookAndFeel";
import {SophonFooter} from "./components/theme/SophonFooter";


export default function App() {
    return (
        <LookAndFeel>
            <LookAndFeel.Bluelib>
                <LookAndFeel.PageTitle/>
                <LayoutThreeCol>
                    <LayoutThreeCol.Center>
                        <LookAndFeel.Heading level={1}/>
                        <SophonFooter/>
                    </LayoutThreeCol.Center>
                </LayoutThreeCol>
            </LookAndFeel.Bluelib>
        </LookAndFeel>
    );
}

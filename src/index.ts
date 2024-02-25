import { Vex, Flow, Factory, Stave, EasyScore } from "vexflow";

import { allKeys, Note } from "./core/notes";
import * as Scales from "./core/scales";
import { ComboBox } from "./components/comboBox";
import { ScaleView } from "./components/scaleView";
import "../styles/input.css";

const availableScales: Scales.ScaleType[] = [
    Scales.MajorScale,
    Scales.MinorScale,
    Scales.HarmonicScale,
    Scales.MelodicScale,
    Scales.MajorPentatonicScale,
    Scales.MinorPentatonicScale,
    Scales.BluesScale,
    Scales.DorianScale,
    Scales.PhrygianScale,
    Scales.LydianScale,
    Scales.MixolydianScale,
    Scales.LocrianScale,
];

document.addEventListener("DOMContentLoaded", () => {
    // const keySelectorDiv = document.getElementById("key-selector");
    // if (keySelectorDiv) {
    //     const keyDropdown = new MultiSelectDropdown(allKeys);
    //     keyDropdown.render(keySelectorDiv);

    //     keyDropdown.addEventListener("change", (event) => {
    //         console.log(event.target.value);
    //     });
    // }
    const scaleViewDiv = document.getElementById("scale-view") as HTMLDivElement;
    let scaleView: ScaleView | undefined;
    if (scaleViewDiv) {
        scaleView = new ScaleView(new Note("C"), Scales.MajorScale);
        scaleView.render(scaleViewDiv);
    }

    const scaleSelectorDiv = document.getElementById("scale-selector");
    if (scaleView && scaleSelectorDiv) {
        let options = availableScales;
        const scaleDropdown = new ComboBox(
            options,
            scaleView.updateComponent.bind(scaleView),
            Scales.MajorScale,
        );
        scaleDropdown.render(scaleSelectorDiv);
    }
});

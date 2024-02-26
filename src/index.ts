import { allKeys, Note } from "./core/notes";
import * as Scales from "./core/scales";
import { ComboBox } from "./components/comboBox";
import { ScaleView } from "./components/scaleView/scaleView";

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

const availableNotes: Note[] = [
    new Note("C", 4),
    new Note("C#", 4),
    new Note("Db", 4),
    new Note("D", 4),
    new Note("D#", 4),
    new Note("Eb", 4),
    new Note("E", 4),
    new Note("F", 4),
    new Note("F#", 4),
    new Note("Gb", 4),
    new Note("G", 4),
    new Note("G#", 4),
    new Note("Ab", 4),
    new Note("A", 4),
    new Note("A#", 4),
    new Note("Bb", 3),
    new Note("B", 3),
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
        scaleView = new ScaleView(new Note("C", 4), Scales.MajorScale);
        scaleView.render(scaleViewDiv);
    }

    const keySelectorDiv = document.getElementById("key-selector");
    if (scaleView && keySelectorDiv) {
        let options = availableNotes;
        const keyDropdown = new ComboBox(
            "Select key:",
            options,
            scaleView.updateComponent.bind(scaleView),
            options[0]
        );
        keyDropdown.render(keySelectorDiv);
    }

    const scaleSelectorDiv = document.getElementById("scale-selector");
    if (scaleView && scaleSelectorDiv) {
        let options = availableScales;
        const scaleDropdown = new ComboBox(
            "Select scale:",
            options,
            scaleView.updateComponent.bind(scaleView),
            options[0]
        );
        scaleDropdown.render(scaleSelectorDiv);
    }
});

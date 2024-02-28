import { allKeys, Note } from "./core/notes";
import * as Scales from "./core/scales";
import { ComboBox } from "./components/comboBox";
import { ScaleView } from "./components/scaleView/scaleView";
import { toggleModal } from "./components/modal";
(window as any).toggleModal = toggleModal;
import "../public/styles/navBar.css";
import "../public/styles/pico.blue.css";

const availableScales: Scales.ScaleType[] = [
    Scales.MajorScale,
    Scales.MinorScale,
    Scales.HarmonicScale,
    Scales.MelodicScale,
    Scales.MajorPentatonicScale,
    Scales.MinorPentatonicScale,
    Scales.BluesScale,
    Scales.BebopMajorScale,
    Scales.BebopDominantScale,
    Scales.BebopDorianScale,
    Scales.BebopMelodicMinorScale,
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
    new Note("Cb", 4),
];

document.addEventListener("DOMContentLoaded", () => {
    // Get cached values or use the first available note and scale
    const savedKey = localStorage.getItem("key-selector-inspector-default");
    let defaultKey = savedKey
        ? availableNotes.find((note) => note.toString() === savedKey)
        : availableNotes[0];
    defaultKey = defaultKey ? defaultKey : availableNotes[0];
    const savedScale = localStorage.getItem("scale-selector-inspector-default");
    let defaultScale = savedScale
        ? availableScales.find((scale) => scale.toString() === savedScale)
        : availableScales[0];
    defaultScale = defaultScale ? defaultScale : availableScales[0];

    const scaleViewDiv = document.getElementById("scale-view-inspector") as HTMLDivElement;
    let scaleView: ScaleView | undefined;
    if (scaleViewDiv) {
        scaleView = new ScaleView(defaultKey, defaultScale);
        scaleView.render(scaleViewDiv);
    }

    const keySelectorDiv = document.getElementById("key-selector-inspector");
    if (scaleView && keySelectorDiv) {
        const keyDropdown = new ComboBox(
            "Select key:",
            availableNotes,
            scaleView.updateComponent.bind(scaleView),
            defaultKey
        );
        keyDropdown.render(keySelectorDiv);
    }

    const scaleSelectorDiv = document.getElementById("scale-selector-inspector");
    if (scaleView && scaleSelectorDiv) {
        const scaleDropdown = new ComboBox(
            "Select scale:",
            availableScales,
            scaleView.updateComponent.bind(scaleView),
            defaultScale
        );
        scaleDropdown.render(scaleSelectorDiv);
    }
});

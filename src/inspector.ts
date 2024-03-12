import { availableScales, allNotes } from "./core/constants";

import { ComboBox } from "./components/comboBox/comboBox";
import { ScaleView } from "./components/scaleView/scaleView";
import { toggleModal } from "./components/modal";
(window as any).toggleModal = toggleModal;

import "../public/styles/navBar.css";
import "../public/styles/footer.css";
import "../public/styles/pico.blue.css";

document.addEventListener("DOMContentLoaded", () => {
    // Get cached values or use the first available note and scale
    const savedKey = localStorage.getItem("key-selector-inspector-default");
    let defaultKey = savedKey ? allNotes.find((note) => note.toString() === savedKey) : allNotes[0];
    defaultKey = defaultKey ? defaultKey : allNotes[0];
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
            allNotes,
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

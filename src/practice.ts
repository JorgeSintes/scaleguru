import { availableNotes, availableScales, availableRoutines, scalePresets } from "./constants";

import { Routine, RoutineConfig, RoutineType } from "./core/routine";

// UI components
import { Checkbox } from "./components/checkbox";
import { ComboBox, Option as ComboBoxOption } from "./components/comboBox/comboBox";
import { CheckboxDropdown, Options as CheckboxOptions } from "./components/checkboxDropdown/checkboxDropdown";
import { ScaleViewPractice } from "./components/scaleViewPractice/scaleViewPractice";
import { toggleModal } from "./components/modal";
(window as any).toggleModal = toggleModal;

import "../public/styles/practice.css";
import "../public/styles/navBar.css";
import "../public/styles/footer.css";
import "../public/styles/pico.blue.css";

const savedNotes = localStorage.getItem("key-selector-practice-default");
let defaultNotes = savedNotes
    ? availableNotes.filter((note) => savedNotes.split(",").includes(note.toString()))
    : availableNotes;

const savedScales = localStorage.getItem("scale-selector-practice-default");
let defaultScales = savedScales
    ? availableScales.filter((scale) => savedScales.split(",").includes(scale.toString()))
    : availableScales;

const savedRoutines = localStorage.getItem("routine-selector-practice-default");
let defaultRoutine = savedRoutines
    ? availableRoutines.find((routine) => savedRoutines.includes(routine.toString()))
    : availableRoutines[0];
defaultRoutine = defaultRoutine ? defaultRoutine : availableRoutines[0];

const savedScalePreset = localStorage.getItem("scale-preset-selector-practice-default");
let availableScalePresets = Object.keys(scalePresets);
let defaultScalePreset = savedScalePreset
    ? availableScalePresets.find((preset) => savedScalePreset.includes(preset.toString()))
    : availableScalePresets[0];
defaultScalePreset = defaultScalePreset ? defaultScalePreset : availableScalePresets[0];
(window as any).scalePresets = scalePresets;

(window as any).keyDropdown = new CheckboxDropdown(
    "Select keys:",
    availableNotes,
    (selectedNotes: CheckboxOptions) => console.log(selectedNotes),
    defaultNotes
);
(window as any).scaleDropdown = new CheckboxDropdown(
    "Select scales:",
    availableScales,
    (selectedScales: CheckboxOptions) => console.log(selectedScales),
    defaultScales
);
(window as any).routineDropdown = new ComboBox(
    "Select routine:",
    availableRoutines,
    (selectedRoutine: ComboBoxOption) => {
        if (selectedRoutine === RoutineType.RandomScale) {
            (window as any).randomizeKeysCheckbox.setValue(true);
            (window as any).randomizeKeysCheckbox.disableCheckbox();
            (window as any).randomizeScalesCheckbox.setValue(true);
            (window as any).randomizeScalesCheckbox.disableCheckbox();
        } else {
            (window as any).randomizeKeysCheckbox.enableCheckbox();
            (window as any).randomizeScalesCheckbox.enableCheckbox();
        }
    },
    defaultRoutine
);
(window as any).scalePresetDropdown = new ComboBox(
    "Select scale preset:",
    availableScalePresets,
    (selectedPreset: ComboBoxOption) => {
        selectedPreset = selectedPreset as string;
        (window as any).scaleDropdown.setSelectedOptions((window as any).scalePresets[selectedPreset]);
    },
    defaultScalePreset
);
(window as any).randomizeKeysCheckbox = new Checkbox(
    "randomize-keys-checkbox-practice",
    "Randomize keys",
    false,
    false,
    (value: boolean) => console.log(value)
);
(window as any).randomizeScalesCheckbox = new Checkbox(
    "randomize-scales-checkbox-practice",
    "Randomize scales",
    false,
    false,
    (value: boolean) => console.log(value)
);
(window as any).showScalesCheckbox = new Checkbox(
    "show-scales-checkbox-practice",
    "Automatically show scales",
    false,
    false,
    (value: boolean) => console.log(value)
);
(window as any).routine = null;
(window as any).practiceScaleView = null;
(window as any).routineIdx = 0;

document.addEventListener("DOMContentLoaded", () => {
    const keySelectorDiv = document.getElementById("key-selector-practice");
    if (keySelectorDiv) {
        (window as any).keyDropdown.render(keySelectorDiv);
    }

    const scaleSelectorDiv = document.getElementById("scale-selector-practice");
    if (scaleSelectorDiv) {
        (window as any).scaleDropdown.render(scaleSelectorDiv);
    }

    const routineSelectorDiv = document.getElementById("routine-selector-practice");
    if (routineSelectorDiv) {
        (window as any).routineDropdown.render(routineSelectorDiv);
    }

    const randomizeKeysDiv = document.getElementById("randomize-keys-checkbox-practice");
    if (randomizeKeysDiv) {
        (window as any).randomizeKeysCheckbox.render(randomizeKeysDiv);
    }
    const randomizeScalesDiv = document.getElementById("randomize-scales-checkbox-practice");
    if (randomizeScalesDiv) {
        (window as any).randomizeScalesCheckbox.render(randomizeScalesDiv);
    }
    const showScalesDiv = document.getElementById("show-scales-checkbox-practice");
    if (showScalesDiv) {
        (window as any).showScalesCheckbox.render(showScalesDiv);
    }

    const scalePresetSelectorDiv = document.getElementById("scale-preset-selector-practice");
    if (scalePresetSelectorDiv) {
        (window as any).scalePresetDropdown.render(scalePresetSelectorDiv);
    }

    const start_button = document.getElementById("start-practice");
    if (start_button) {
        start_button.addEventListener("click", () => {
            if (
                !(window as any).keyDropdown ||
                !(window as any).scaleDropdown ||
                !(window as any).routineDropdown
            ) {
                return;
            }
            let config: RoutineConfig = {
                keys: (window as any).keyDropdown.getSelectedOptions(),
                scales: (window as any).scaleDropdown.getSelectedOptions(),
                routineType: (window as any).routineDropdown.getSelectedOption(),
                randomizeKeys: (window as any).randomizeKeysCheckbox.getValue(),
                randomizeScales: (window as any).randomizeScalesCheckbox.getValue(),
            };
            handleLaunch(config);
        });
    }
});

function handleLaunch(config: RoutineConfig) {
    let configMenus = document.getElementById("config-menus") as HTMLDivElement;
    let practiceCard = document.getElementById("scale-view-practice") as HTMLDivElement;
    configMenus.style.display = "none";
    (window as any).routine = new Routine(config);
    (window as any).practiceScaleView = new ScaleViewPractice(
        (window as any).routine,
        handleBack,
        (window as any).showScalesCheckbox.getValue()
    );
    (window as any).practiceScaleView.render(practiceCard);
}

function handleBack() {
    let configMenus = document.getElementById("config-menus") as HTMLDivElement;
    let practiceCard = document.getElementById("scale-view-practice") as HTMLDivElement;
    configMenus.style.display = "block";
    (window as any).practiceScaleView.destroy();
    (window as any).routine = null;
    (window as any).practiceScaleView = null;
}

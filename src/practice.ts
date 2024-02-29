import { Note } from "./core/notes";
import * as Scales from "./core/scales";
import { Routine, RoutineConfig, RoutineType } from "./core/routine";
import { ComboBox, Option as ComboBoxOption } from "./components/comboBox";
import { CheckboxDropdown, Options as CheckboxOptions } from "./components/checkboxDropdown/checkboxDropdown";
import { ScaleViewPractice } from "./components/scaleViewPractice/scaleViewPractice";
import { toggleModal } from "./components/modal";
(window as any).toggleModal = toggleModal;
import "../public/styles/practice.css";
import "../public/styles/navBar.css";
import "../public/styles/footer.css";
import "../public/styles/pico.blue.css";

const availableScales: Scales.ScaleType[] = [
    Scales.MajorScale,
    Scales.DorianScale,
    Scales.PhrygianScale,
    Scales.LydianScale,
    Scales.MixolydianScale,
    Scales.MinorScale,
    Scales.LocrianScale,
    Scales.MelodicMinorScale,
    Scales.DorianFlat2Scale,
    Scales.LydianAugmentedScale,
    Scales.LydianDominantScale,
    Scales.AeolianDominantScale,
    Scales.LocrianNatural2Scale,
    Scales.AlteredScale,
    Scales.HarmonicMinorScale,
    Scales.LocrianNatural6Scale,
    Scales.AugmentedMajorScale,
    Scales.LydianMinorScale,
    Scales.PhrygianDominantScale,
    Scales.LydianSharp2Scale,
    Scales.AlteredDiminishedScale,
    Scales.MajorPentatonicScale,
    Scales.MinorPentatonicScale,
    Scales.BluesScale,
    Scales.BebopMajorScale,
    Scales.BebopDominantScale,
    Scales.BebopDorianScale,
    Scales.BebopMelodicMinorScale,
    Scales.WholeToneScale,
    Scales.WholeHalfDiminishedScale,
    Scales.HalfWholeDiminishedScale,
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

const availableRoutines: RoutineType[] = [
    RoutineType.MantainScaleChangeKey,
    RoutineType.MantainKeyChangeScale,
    RoutineType.RandomScale,
];

const savedNotes = localStorage.getItem("key-selector-practice-default");
let defaultNotes = savedNotes
    ? availableNotes.filter((note) => savedNotes.includes(note.toString()))
    : availableNotes;
const savedScales = localStorage.getItem("scale-selector-practice-default");
let defaultScales = savedScales
    ? availableScales.filter((scale) => savedScales.includes(scale.toString()))
    : availableScales;
const savedRoutines = localStorage.getItem("routine-selector-practice-default");
let defaultRoutine = savedRoutines
    ? availableRoutines.find((routine) => savedRoutines.includes(routine.toString()))
    : availableRoutines[0];
defaultRoutine = defaultRoutine ? defaultRoutine : availableRoutines[0];
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
    (selectedRoutine: ComboBoxOption) => console.log(selectedRoutine),
    defaultRoutine
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
                randomizeKeys: false,
                randomizeScales: false,
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
    (window as any).practiceScaleView = new ScaleViewPractice((window as any).routine, handleBack);
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

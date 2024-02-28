import { Note } from "./core/notes";
import * as Scales from "./core/scales";
import { Routine, RoutineConfig, RoutineType } from "./core/routine";
import { ComboBox, Option as ComboBoxOption } from "./components/comboBox";
import { CheckboxDropdown, Options as CheckboxOptions } from "./components/checkboxDropdown/checkboxDropdown";
import "../public/styles/practice.css";
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

const availableRoutines: RoutineType[] = [
    RoutineType.MantainScaleChangeKey,
    RoutineType.MantainKeyChangeScale,
    RoutineType.RandomScale,
];

class State {}

document.addEventListener("DOMContentLoaded", () => {
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

    const keySelectorDiv = document.getElementById("key-selector-practice");
    if (keySelectorDiv) {
        const keyDropdown = new CheckboxDropdown(
            "Select keys:",
            availableNotes,
            (selectedNotes: CheckboxOptions) => console.log(selectedNotes),
            defaultNotes
        );
        keyDropdown.render(keySelectorDiv);
    }

    const scaleSelectorDiv = document.getElementById("scale-selector-practice");
    if (scaleSelectorDiv) {
        const scaleDropdown = new CheckboxDropdown(
            "Select scales:",
            availableScales,
            (selectedScales: CheckboxOptions) => console.log(selectedScales),
            defaultScales
        );
        scaleDropdown.render(scaleSelectorDiv);
    }

    const routineSelectorDiv = document.getElementById("routine-selector-practice");
    if (routineSelectorDiv) {
        const routineDropdown = new ComboBox(
            "Select routine:",
            availableRoutines,
            (selectedRoutine: ComboBoxOption) => console.log(selectedRoutine),
            defaultRoutine
        );
        routineDropdown.render(routineSelectorDiv);
    }
});

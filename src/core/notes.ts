import Vex from "vexflow";

const noteNamesF = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
const noteNamesS = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const circleFifths = ["F", "C", "G", "D", "A", "E", "B"];
const naturalNoteNames = ["C", "D", "E", "F", "G", "A", "B"];
const allKeys = [
    "C",
    "C#",
    "Db",
    "D",
    "D#",
    "Eb",
    "E",
    "F",
    "F#",
    "Gb",
    "G",
    "G#",
    "Ab",
    "A",
    "A#",
    "Bb",
    "B",
];

function isValidNoteName(noteName: string): boolean {
    if (!circleFifths.includes(noteName[0])) {
        return false;
    }
    for (const post of noteName.slice(1)) {
        if (post !== "#" && post !== "b") {
            return false;
        }
    }
    return true;
}

function noteToInt(note: string): number {
    if (!isValidNoteName(note)) {
        throw new Error(`Invalid note name: ${note}`);
    }
    if (!noteNamesF.includes(note) && !noteNamesS.includes(note)) {
        note = reduceAccidentals(note);
    }
    if (noteNamesF.includes(note)) {
        return noteNamesF.indexOf(note);
    }
    return noteNamesS.indexOf(note);
}

function reduceAccidentals(note: string): string {
    if (!isValidNoteName(note)) {
        throw new Error(`Invalid note name: ${note}`);
    }
    let noteVal = noteToInt(note[0]);
    let accidentVal = 0;
    for (const token of note.slice(1)) {
        if (token === "#") {
            accidentVal++;
        } else if (token === "b") {
            accidentVal--;
        }
    }
    if (accidentVal < 0) {
        return noteNamesF[(noteVal + accidentVal) % 12];
    }
    return noteNamesF[(noteVal + accidentVal) % 12];
}

class Note {
    name: string;
    position: number;
    constructor(name: string) {
        if (!isValidNoteName(name)) {
            throw new Error(`Invalid note name: ${name}`);
        }
        this.name = name;
        this.position = noteToInt(this.name);
    }

    static fromInt(position: number, accidental: string = "#"): Note {
        if (accidental !== "#" && accidental !== "b") {
            throw new Error(`Invalid accidental: ${accidental}`);
        }
        if (accidental === "#") {
            return new Note(noteNamesS[position]);
        }
        return new Note(noteNamesF[position]);
    }
    toInt(): number {
        return this.position;
    }
    toString(): string {
        return `${this.name}`;
    }
    toVexflow(): Vex.Flow.StaveNote {
        let name: string = this.name;
        let accidental: string = "";
        if (name.length > 1) {
            accidental = name.slice(1);
            name = name[0];
        }
        let vexNote = new Vex.Flow.StaveNote({
            keys: [name + "/4"],
            duration: "q",
        });
        if (accidental.length > 0) {
            vexNote.addModifier(new Vex.Flow.Accidental(accidental), 0);
        }
        return vexNote;
    }

    equals(other: Note): boolean {
        return this.name === other.name;
    }
    distanceTo(other: Note): number {
        // assumes other is a higher note than this
        if (this.position > other.position) {
            return other.position - this.position + 12;
        }
        return other.position - this.position;
    }

    reduceAccidentals(): Note {
        return new Note(reduceAccidentals(this.name));
    }

    enharmonicEquivalent(): Note {
        if (noteNamesF.includes(this.name)) {
            return new Note(noteNamesS[this.position]);
        }
        return new Note(noteNamesF[this.position]);
    }

    augment(): Note {
        if (!this.name.endsWith("b")) {
            return new Note(this.name + "#");
        }
        return new Note(reduceAccidentals(this.name.slice(0, -1)));
    }
    diminish(): Note {
        if (!this.name.endsWith("#")) {
            return new Note(this.name + "b");
        }
        return new Note(reduceAccidentals(this.name.slice(0, -1)));
    }
    halfstepUp(): Note {
        return Note.fromInt((this.position + 1) % 12, "#");
    }
    halfstepDown(): Note {
        return Note.fromInt((this.position + 1) % 12, "b");
    }

    // Intervals
    minorSecond(): Note {
        let nextNote = new Note(naturalNoteNames[(naturalNoteNames.indexOf(this.name[0]) + 1) % 7]);
        let diff = this.distanceTo(nextNote) - 1;
        if (diff < 0) {
            nextNote = new Note(nextNote.name + "#".repeat(Math.abs(diff)));
        } else if (diff > 0) {
            nextNote = new Note(nextNote.name + "b".repeat(diff));
        }
        return nextNote;
    }
    majorSecond(): Note {
        let nextNote = new Note(naturalNoteNames[(naturalNoteNames.indexOf(this.name[0]) + 1) % 7]);
        let diff = this.distanceTo(nextNote) - 2;
        if (diff < 0) {
            nextNote = new Note(nextNote.name + "#".repeat(Math.abs(diff)));
        } else if (diff > 0) {
            nextNote = new Note(nextNote.name + "b".repeat(diff));
        }
        return nextNote;
    }
    augmentedSecond(): Note {
        let nextNote = new Note(naturalNoteNames[(naturalNoteNames.indexOf(this.name[0]) + 1) % 7]);
        let diff = this.distanceTo(nextNote) - 3;
        if (diff < 0) {
            nextNote = new Note(nextNote.name + "#".repeat(Math.abs(diff)));
        } else if (diff > 0) {
            nextNote = new Note(nextNote.name + "b".repeat(diff));
        }
        return nextNote;
    }
    minorThird(): Note {
        return this.majorSecond().minorSecond();
    }
    majorThird(): Note {
        return this.majorSecond().majorSecond();
    }
    diminishedForth(): Note {
        return this.minorThird().minorSecond();
    }
    perfectForth(): Note {
        return this.majorThird().minorSecond();
    }
    augmentedForth(): Note {
        return this.majorThird().majorSecond();
    }
    diminishedFifth(): Note {
        return this.perfectForth().minorSecond();
    }
    perfectFifth(): Note {
        return this.perfectForth().majorSecond();
    }
    augmentedFifth(): Note {
        return this.augmentedForth().majorSecond();
    }
    minorSixth(): Note {
        return this.perfectFifth().minorSecond();
    }
    majorSixth(): Note {
        return this.perfectFifth().majorSecond();
    }
    minorSeventh(): Note {
        return this.majorSixth().minorSecond();
    }
    majorSeventh(): Note {
        return this.majorSixth().majorSecond();
    }
}

export { Note, allKeys };

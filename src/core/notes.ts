import { Vex } from "vexflow";
const { StaveNote, Accidental } = Vex.Flow;

const noteNamesF = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
const noteNamesS = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const circleFifths = ["F", "C", "G", "D", "A", "E", "B"];
const naturalNoteNames = ["C", "D", "E", "F", "G", "A", "B"];

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

function noteToAbsPosition(note: string, octave: number): number {
    if (!isValidNoteName(note)) {
        throw new Error(`Invalid note name: ${note}`);
    }
    if (!noteNamesF.includes(note) && !noteNamesS.includes(note)) {
        let reduced = reduceAccidentals(note, octave);
        note = reduced.note;
        octave = reduced.octave;
    }
    if (noteNamesF.includes(note)) {
        var position = noteNamesF.indexOf(note);
    } else {
        var position = noteNamesS.indexOf(note);
    }

    return position + octave * 12;
}

function reduceAccidentals(note: string, octave: number): { note: string; octave: number } {
    if (!isValidNoteName(note)) {
        throw new Error(`Invalid note name: ${note}`);
    }
    let noteAbsPosition = noteToAbsPosition(note[0], octave);
    let accidentVal = 0;
    for (const token of note.slice(1)) {
        if (token === "#") {
            accidentVal++;
        } else if (token === "b") {
            accidentVal--;
        }
    }
    if (accidentVal < 0) {
        return {
            note: noteNamesF[(noteAbsPosition + accidentVal) % 12],
            octave: Math.floor((noteAbsPosition + accidentVal) / 12),
        };
    }
    return {
        note: noteNamesS[(noteAbsPosition + accidentVal) % 12],
        octave: Math.floor((noteAbsPosition + accidentVal) / 12),
    };
}

export class Note {
    name: string;
    position: number;
    octave: number;
    absPosition: number;
    constructor(name: string, octave: number) {
        if (!isValidNoteName(name)) {
            throw new Error(`Invalid note name: ${name}`);
        }
        this.name = name;
        this.octave = octave;
        this.absPosition = noteToAbsPosition(this.name, this.octave);
        this.position = this.absPosition % 12;
    }
    static fromAbsPosition(note_name: string, absPosition: number) {
        var pos = noteToAbsPosition(note_name, 0);
        var offset = (absPosition - pos) % 12;
        if (offset <= 6) {
            var octave = Math.floor((absPosition - pos) / 12);
        } else {
            var octave = Math.floor((absPosition - pos) / 12) + 1;
            offset = offset - 12;
        }
        if (offset >= 0) {
            return new Note(note_name + "#".repeat(offset), octave);
        } else {
            return new Note(note_name + "b".repeat(Math.abs(offset)), octave);
        }
    }
    toInt(): number {
        return this.position;
    }
    toString(): string {
        return `${this.name}`;
    }
    toVexflow(): any {
        let name: string = this.name;
        let accidental: string = "";
        if (name.length > 1) {
            accidental = name.slice(1);
            name = name[0];
        }
        let vexNote = new StaveNote({
            keys: [name + `/${this.octave}`],
            duration: "q",
        });
        if (accidental.length > 0) {
            vexNote.addModifier(new Accidental(accidental), 0);
        }
        return vexNote as any;
    }

    equals(other: Note): boolean {
        return this.name === other.name;
    }
    distanceTo(other: Note): number {
        return other.absPosition - this.absPosition;
    }

    getNumAccidentals(): number {
        return this.name.slice(1).length;
    }

    reduceAccidentals(): Note {
        let reduced = reduceAccidentals(this.name, this.octave);
        return new Note(reduced.note, reduced.octave);
    }

    enharmonicEquivalent(): Note {
        if (!noteNamesF.includes(this.name) && !noteNamesS.includes(this.name)) {
            return this.reduceAccidentals();
        }
        if (noteNamesF.includes(this.name)) {
            return new Note(noteNamesS[this.position], this.octave);
        }
        return new Note(noteNamesF[this.position], this.octave);
    }

    augment(): Note {
        if (!this.name.endsWith("b")) {
            return new Note(this.name + "#", this.octave);
        }
        let reduced = reduceAccidentals(this.name.slice(0, -1), this.octave);
        return new Note(reduced.note, reduced.octave);
    }
    diminish(): Note {
        if (!this.name.endsWith("#")) {
            return new Note(this.name + "b", this.octave);
        }
        let reduced = reduceAccidentals(this.name.slice(0, -1), this.octave);
        return new Note(reduced.note, reduced.octave);
    }
    halfstepUp(): Note {
        let newNote = this.augment();
        return newNote.reduceAccidentals();
    }
    halfstepDown(): Note {
        let newNote = this.diminish();
        return newNote.reduceAccidentals();
    }

    // Intervals
    minorSecond(): Note {
        let thisNoteIdx = naturalNoteNames.indexOf(this.name[0]);
        let nextNoteIdx = (thisNoteIdx + 1) % 7;
        return Note.fromAbsPosition(naturalNoteNames[nextNoteIdx], this.absPosition + 1);
    }
    majorSecond(): Note {
        let thisNoteIdx = naturalNoteNames.indexOf(this.name[0]);
        let nextNoteIdx = (thisNoteIdx + 1) % 7;
        return Note.fromAbsPosition(naturalNoteNames[nextNoteIdx], this.absPosition + 2);
    }
    augmentedSecond(): Note {
        let thisNoteIdx = naturalNoteNames.indexOf(this.name[0]);
        let nextNoteIdx = (thisNoteIdx + 1) % 7;
        return Note.fromAbsPosition(naturalNoteNames[nextNoteIdx], this.absPosition + 3);
    }
    minorThird(): Note {
        let thisNoteIdx = naturalNoteNames.indexOf(this.name[0]);
        let nextNoteIdx = (thisNoteIdx + 2) % 7;
        return Note.fromAbsPosition(naturalNoteNames[nextNoteIdx], this.absPosition + 3);
    }
    majorThird(): Note {
        let thisNoteIdx = naturalNoteNames.indexOf(this.name[0]);
        let nextNoteIdx = (thisNoteIdx + 2) % 7;
        return Note.fromAbsPosition(naturalNoteNames[nextNoteIdx], this.absPosition + 4);
    }
    diminishedForth(): Note {
        let thisNoteIdx = naturalNoteNames.indexOf(this.name[0]);
        let nextNoteIdx = (thisNoteIdx + 3) % 7;
        return Note.fromAbsPosition(naturalNoteNames[nextNoteIdx], this.absPosition + 4);
    }
    perfectForth(): Note {
        let thisNoteIdx = naturalNoteNames.indexOf(this.name[0]);
        let nextNoteIdx = (thisNoteIdx + 3) % 7;
        return Note.fromAbsPosition(naturalNoteNames[nextNoteIdx], this.absPosition + 5);
    }
    augmentedForth(): Note {
        let thisNoteIdx = naturalNoteNames.indexOf(this.name[0]);
        let nextNoteIdx = (thisNoteIdx + 3) % 7;
        return Note.fromAbsPosition(naturalNoteNames[nextNoteIdx], this.absPosition + 6);
    }
    diminishedFifth(): Note {
        let thisNoteIdx = naturalNoteNames.indexOf(this.name[0]);
        let nextNoteIdx = (thisNoteIdx + 4) % 7;
        return Note.fromAbsPosition(naturalNoteNames[nextNoteIdx], this.absPosition + 6);
    }
    perfectFifth(): Note {
        let thisNoteIdx = naturalNoteNames.indexOf(this.name[0]);
        let nextNoteIdx = (thisNoteIdx + 4) % 7;
        return Note.fromAbsPosition(naturalNoteNames[nextNoteIdx], this.absPosition + 7);
    }
    augmentedFifth(): Note {
        let thisNoteIdx = naturalNoteNames.indexOf(this.name[0]);
        let nextNoteIdx = (thisNoteIdx + 4) % 7;
        return Note.fromAbsPosition(naturalNoteNames[nextNoteIdx], this.absPosition + 8);
    }
    minorSixth(): Note {
        let thisNoteIdx = naturalNoteNames.indexOf(this.name[0]);
        let nextNoteIdx = (thisNoteIdx + 5) % 7;
        return Note.fromAbsPosition(naturalNoteNames[nextNoteIdx], this.absPosition + 8);
    }
    majorSixth(): Note {
        let thisNoteIdx = naturalNoteNames.indexOf(this.name[0]);
        let nextNoteIdx = (thisNoteIdx + 5) % 7;
        return Note.fromAbsPosition(naturalNoteNames[nextNoteIdx], this.absPosition + 9);
    }
    minorSeventh(): Note {
        let thisNoteIdx = naturalNoteNames.indexOf(this.name[0]);
        let nextNoteIdx = (thisNoteIdx + 6) % 7;
        return Note.fromAbsPosition(naturalNoteNames[nextNoteIdx], this.absPosition + 10);
    }
    majorSeventh(): Note {
        let thisNoteIdx = naturalNoteNames.indexOf(this.name[0]);
        let nextNoteIdx = (thisNoteIdx + 6) % 7;
        return Note.fromAbsPosition(naturalNoteNames[nextNoteIdx], this.absPosition + 11);
    }
}

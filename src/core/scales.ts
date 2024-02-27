import { Note } from "./notes";
import Vex from "vexflow";

abstract class IScale {
    // Both distances and descending_distances are represented from the bottom note to the top note.
    // descending_distances is null if the scale is not symmetric.
    protected distances: ReadonlyArray<string> = [];
    protected descending_distances: ReadonlyArray<string> | null = null;
    protected root: Note;

    constructor(root: Note) {
        this.root = root;
    }

    static toString(): string {
        return "Scale";
    }

    getName(): string {
        return `${this.root.toString()} ${this.constructor.toString()}`;
    }

    toVexflow(): Vex.Flow.StaveNote[] {
        let result: Vex.Flow.StaveNote[] = [];
        for (const note of this.ascending()) {
            result.push(note.toVexflow());
        }
        return result;
    }

    ascending(): Note[] {
        let result: Note[] = [this.root];
        let current = this.root;
        for (const distance of this.distances) {
            if (distance === "#1") {
                current = current.augment();
                result.push(current);
            } else if (distance === "b2") {
                current = current.minorSecond();
                result.push(current);
            } else if (distance === "2") {
                current = current.majorSecond();
                result.push(current);
            } else if (distance === "#2") {
                current = current.augmentedSecond();
                result.push(current);
            } else if (distance === "b3") {
                current = current.minorThird();
                result.push(current);
            }
        }
        return result;
    }

    descending(): Note[] {
        if (this.descending_distances === null) {
            return this.ascending().reverse();
        }
        let distancesCache = this.distances;
        this.distances = this.descending_distances;
        let result = this.ascending().reverse();
        this.distances = distancesCache;
        return result;
    }

    degree(degree: number): Note {
        if (degree < 1 || degree > this.distances.length + 1) {
            throw new Error("Invalid degree");
        }
        return this.ascending()[degree - 1];
    }
}

// Classical scales
class MajorScale extends IScale {
    protected distances: ReadonlyArray<string> = ["2", "2", "b2", "2", "2", "2", "b2"];
    static toString(): string {
        return "Major";
    }
}

class MinorScale extends IScale {
    protected distances: ReadonlyArray<string> = ["2", "b2", "2", "2", "b2", "2", "2"];
    static toString(): string {
        return "Minor";
    }
}

class HarmonicScale extends IScale {
    protected distances: ReadonlyArray<string> = ["2", "b2", "2", "2", "b2", "#2", "b2"];
    static toString(): string {
        return "Harmonic minor";
    }
}

class MelodicScale extends IScale {
    protected distances: ReadonlyArray<string> = ["2", "b2", "2", "2", "2", "2", "b2"];
    protected descending_distances: ReadonlyArray<string> = ["2", "b2", "2", "2", "b2", "2", "2"];
    static toString(): string {
        return "Melodic minor";
    }
}

// Pentatonic scales
class MajorPentatonicScale extends IScale {
    protected distances: ReadonlyArray<string> = ["2", "2", "b3", "2", "b3"];
    static toString(): string {
        return "Major pentatonic";
    }
}

class MinorPentatonicScale extends IScale {
    protected distances: ReadonlyArray<string> = ["b3", "2", "2", "b3", "2"];
    static toString(): string {
        return "Minor pentatonic";
    }
}

class BluesScale extends IScale {
    protected distances: ReadonlyArray<string> = ["b3", "2", "#1", "b2", "b3", "2"];
    protected descending_distances: ReadonlyArray<string> = ["b3", "2", "b2", "#1", "b3", "2"];
    static toString(): string {
        return "Blues";
    }
}

// Bebop scales
class BebopMajorScale extends IScale {
    protected distances: ReadonlyArray<string> = ["2", "2", "b2", "2", "b2", "#1", "2", "b2"];
    static toString(): string {
        return "Bebop major";
    }
}

class BebopDominantScale extends IScale {
    protected distances: ReadonlyArray<string> = ["2", "2", "b2", "2", "2", "b2", "#1", "b2"];
    static toString(): string {
        return "Bebop dominant";
    }
}

class BebopDorianScale extends IScale {
    protected distances: ReadonlyArray<string> = ["2", "b2", "#1", "b2", "2", "2", "b2", "2"];
    static toString(): string {
        return "Bebop dorian";
    }
}

class BebopMelodicMinorScale extends IScale {
    protected distances: ReadonlyArray<string> = ["2", "b2", "2", "2", "b2", "#1", "b2", "2"];
    static toString(): string {
        return "Bebop melodic minor";
    }
}

// Major modes
class DorianScale extends IScale {
    protected distances: ReadonlyArray<string> = ["2", "b2", "2", "2", "2", "b2", "2"];
    static toString(): string {
        return "Dorian";
    }
}

class PhrygianScale extends IScale {
    protected distances: ReadonlyArray<string> = ["b2", "2", "2", "2", "b2", "2", "2"];
    static toString(): string {
        return "Phrygian";
    }
}

class LydianScale extends IScale {
    protected distances: ReadonlyArray<string> = ["2", "2", "2", "b2", "2", "2", "b2"];
    static toString(): string {
        return "Lydian";
    }
}

class MixolydianScale extends IScale {
    protected distances: ReadonlyArray<string> = ["2", "2", "b2", "2", "2", "b2", "2"];
    static toString(): string {
        return "Mixolydian";
    }
}

class LocrianScale extends IScale {
    protected distances: ReadonlyArray<string> = ["b2", "2", "2", "b2", "2", "2", "2"];
    static toString(): string {
        return "Locrian";
    }
}

type ScaleType =
    | typeof MajorScale
    | typeof MinorScale
    | typeof HarmonicScale
    | typeof MelodicScale
    | typeof MajorPentatonicScale
    | typeof MinorPentatonicScale
    | typeof BluesScale
    | typeof BebopMajorScale
    | typeof BebopDominantScale
    | typeof BebopDorianScale
    | typeof BebopMelodicMinorScale
    | typeof DorianScale
    | typeof PhrygianScale
    | typeof LydianScale
    | typeof MixolydianScale
    | typeof LocrianScale;

export {
    IScale,
    ScaleType,
    MajorScale,
    MinorScale,
    HarmonicScale,
    MelodicScale,
    MajorPentatonicScale,
    MinorPentatonicScale,
    BluesScale,
    BebopMajorScale,
    BebopDominantScale,
    BebopDorianScale,
    BebopMelodicMinorScale,
    DorianScale,
    PhrygianScale,
    LydianScale,
    MixolydianScale,
    LocrianScale,
};

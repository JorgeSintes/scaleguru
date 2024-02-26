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
        return "Blues scale";
    }
}

// Major modes
class DorianScale extends IScale {
    protected distances: ReadonlyArray<string> = ["2", "b2", "2", "2", "2", "b2", "2"];

    static toString(): string {
        return "Dorian scale";
    }
}

class PhrygianScale extends IScale {
    protected distances: ReadonlyArray<string> = ["b2", "2", "2", "2", "b2", "2", "2"];

    static toString(): string {
        return "Phrygian scale";
    }
}

class LydianScale extends IScale {
    protected distances: ReadonlyArray<string> = ["2", "2", "2", "b2", "2", "2", "b2"];

    static toString(): string {
        return "Lydian scale";
    }
}

class MixolydianScale extends IScale {
    protected distances: ReadonlyArray<string> = ["2", "2", "b2", "2", "2", "b2", "2"];

    static toString(): string {
        return "Mixolydian scale";
    }
}

class LocrianScale extends IScale {
    protected distances: ReadonlyArray<string> = ["b2", "2", "2", "b2", "2", "2", "2"];

    static toString(): string {
        return "Locrian scale";
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
    | typeof DorianScale
    | typeof PhrygianScale
    | typeof LydianScale
    | typeof MixolydianScale
    | typeof LocrianScale;

export {
    ScaleType,
    MajorScale,
    MinorScale,
    HarmonicScale,
    MelodicScale,
    MajorPentatonicScale,
    MinorPentatonicScale,
    BluesScale,
    DorianScale,
    PhrygianScale,
    LydianScale,
    MixolydianScale,
    LocrianScale,
};

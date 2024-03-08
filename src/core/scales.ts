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
            } else if (distance === "bb3") {
                current = current.minorThird().diminish();
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

    getNumAccidentals(): number {
        let numAccidentals = 0;
        for (const note of this.ascending()) {
            numAccidentals += note.getNumAccidentals();
        }
        return numAccidentals;
    }
}

// Major scale and its modes
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

// Melodic minor scale and its modes
class MelodicMinorScale extends IScale {
    protected distances: ReadonlyArray<string> = ["2", "b2", "2", "2", "2", "2", "b2"];
    static toString(): string {
        return "Melodic minor";
    }
}

class DorianFlat2Scale extends IScale {
    protected distances: ReadonlyArray<string> = ["b2", "2", "2", "2", "2", "b2", "2"];
    static toString(): string {
        return "Dorian b2";
    }
}

class LydianAugmentedScale extends IScale {
    protected distances: ReadonlyArray<string> = ["2", "2", "2", "2", "b2", "2", "b2"];
    static toString(): string {
        return "Lydian augmented";
    }
}

class LydianDominantScale extends IScale {
    protected distances: ReadonlyArray<string> = ["2", "2", "2", "b2", "2", "b2", "2"];
    static toString(): string {
        return "Lydian dominant";
    }
}

class AeolianDominantScale extends IScale {
    protected distances: ReadonlyArray<string> = ["2", "2", "b2", "2", "b2", "2", "2"];
    static toString(): string {
        return "Aeolian dominant";
    }
}

class LocrianNatural2Scale extends IScale {
    protected distances: ReadonlyArray<string> = ["2", "b2", "2", "b2", "2", "2", "2"];
    static toString(): string {
        return "Locrian natural 2";
    }
}

class AlteredScale extends IScale {
    protected distances: ReadonlyArray<string> = ["b2", "2", "b2", "2", "2", "2", "2"];
    static toString(): string {
        return "Altered";
    }
}

// Harmonic minor scale and its modes
class HarmonicMinorScale extends IScale {
    protected distances: ReadonlyArray<string> = ["2", "b2", "2", "2", "b2", "#2", "b2"];
    static toString(): string {
        return "Harmonic minor";
    }
}

class LocrianNatural6Scale extends IScale {
    protected distances: ReadonlyArray<string> = ["b2", "2", "2", "b2", "#2", "b2", "2"];
    static toString(): string {
        return "Locrian natural 6";
    }
}

class AugmentedMajorScale extends IScale {
    protected distances: ReadonlyArray<string> = ["2", "2", "b2", "#2", "b2", "2", "b2"];
    static toString(): string {
        return "Augmented Major";
    }
}

class LydianMinorScale extends IScale {
    protected distances: ReadonlyArray<string> = ["2", "b2", "#2", "b2", "2", "b2", "2"];
    static toString(): string {
        return "Lydian minor";
    }
}

class PhrygianDominantScale extends IScale {
    protected distances: ReadonlyArray<string> = ["b2", "#2", "b2", "2", "b2", "2", "2"];
    static toString(): string {
        return "Phrygian dominant";
    }
}

class LydianSharp2Scale extends IScale {
    protected distances: ReadonlyArray<string> = ["#2", "b2", "2", "b2", "2", "2", "b2"];
    static toString(): string {
        return "Lydian #2";
    }
}

class AlteredDiminishedScale extends IScale {
    protected distances: ReadonlyArray<string> = ["b2", "2", "b2", "2", "2", "b2", "#2"];
    static toString(): string {
        return "Altered diminished";
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

class WholeToneScale extends IScale {
    protected distances: ReadonlyArray<string> = ["2", "2", "2", "2", "2", "bb3"];
    static toString(): string {
        return "Whole tone";
    }
}

class WholeHalfDiminishedScale extends IScale {
    protected distances: ReadonlyArray<string> = ["2", "b2", "2", "b2", "2", "#1", "2", "b2"];
    static toString(): string {
        return "Whole-half diminished";
    }
}

class HalfWholeDiminishedScale extends IScale {
    protected distances: ReadonlyArray<string> = ["b2", "2", "#1", "2", "b2", "2", "b2", "2"];
    static toString(): string {
        return "Half-whole diminished";
    }
}

function simplifyScale(root: Note, scale: ScaleType): Note {
    let oneScale = new scale(root);
    let otherScale = new scale(root.enharmonicEquivalent());
    if (oneScale.getNumAccidentals() <= otherScale.getNumAccidentals()) {
        return root;
    }
    return root.enharmonicEquivalent();
}

type ScaleType =
    | typeof MajorScale
    | typeof DorianScale
    | typeof PhrygianScale
    | typeof LydianScale
    | typeof MixolydianScale
    | typeof MinorScale
    | typeof LocrianScale
    | typeof MelodicMinorScale
    | typeof DorianFlat2Scale
    | typeof LydianAugmentedScale
    | typeof LydianDominantScale
    | typeof AeolianDominantScale
    | typeof LocrianNatural2Scale
    | typeof AlteredScale
    | typeof HarmonicMinorScale
    | typeof LocrianNatural6Scale
    | typeof AugmentedMajorScale
    | typeof LydianMinorScale
    | typeof PhrygianDominantScale
    | typeof LydianSharp2Scale
    | typeof AlteredDiminishedScale
    | typeof MajorPentatonicScale
    | typeof MinorPentatonicScale
    | typeof BluesScale
    | typeof BebopMajorScale
    | typeof BebopDominantScale
    | typeof BebopDorianScale
    | typeof BebopMelodicMinorScale
    | typeof WholeToneScale
    | typeof WholeHalfDiminishedScale
    | typeof HalfWholeDiminishedScale;

export {
    IScale,
    ScaleType,
    MajorScale,
    DorianScale,
    PhrygianScale,
    LydianScale,
    MixolydianScale,
    MinorScale,
    LocrianScale,
    MelodicMinorScale,
    DorianFlat2Scale,
    LydianAugmentedScale,
    LydianDominantScale,
    AeolianDominantScale,
    LocrianNatural2Scale,
    AlteredScale,
    HarmonicMinorScale,
    LocrianNatural6Scale,
    AugmentedMajorScale,
    LydianMinorScale,
    PhrygianDominantScale,
    LydianSharp2Scale,
    AlteredDiminishedScale,
    MajorPentatonicScale,
    MinorPentatonicScale,
    BluesScale,
    BebopMajorScale,
    BebopDominantScale,
    BebopDorianScale,
    BebopMelodicMinorScale,
    WholeToneScale,
    WholeHalfDiminishedScale,
    HalfWholeDiminishedScale,
    simplifyScale,
};

import { Note } from "./notes";

abstract class Scale {
    // Both distances and descending_distances are represented from the bottom note to the top note.
    // descending_distances is null if the scale is not symmetric.
    protected distances: ReadonlyArray<string> = [];
    protected descending_distances: ReadonlyArray<string> | null = null;
    protected root: Note;

    constructor(root: Note) {
        this.root = root;
    }

    abstract toString(): string;
    toVexflow(): string[] {
        let result: string[] = [];
        for (const note of this.ascending()) {
            result.push(note.toString());
        }
        result[0] = result[0] + "/q";
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
class MajorScale extends Scale {
    protected distances: ReadonlyArray<string> = ["2", "2", "b2", "2", "2", "2", "b2"];

    toString(): string {
        return `${this.root} major scale`;
    }
}

class MinorScale extends Scale {
    protected distances: ReadonlyArray<string> = ["2", "b2", "2", "2", "b2", "2", "2"];

    toString(): string {
        return `${this.root} minor scale`;
    }
}

class HarmonicScale extends Scale {
    protected distances: ReadonlyArray<string> = ["2", "b2", "2", "2", "b2", "#2", "b2"];

    toString(): string {
        return `${this.root} harmonic minor scale`;
    }
}

class MelodicScale extends Scale {
    protected distances: ReadonlyArray<string> = ["2", "b2", "2", "2", "2", "2", "b2"];
    protected descending_distances: ReadonlyArray<string> = ["2", "b2", "2", "2", "b2", "2", "2"];

    toString(): string {
        return `${this.root} melodic minor scale`;
    }
}

// Pentatonic scales
class MajorPentatonicScale extends Scale {
    protected distances: ReadonlyArray<string> = ["2", "2", "b3", "2", "b3"];

    toString(): string {
        return `${this.root} major pentatonic scale`;
    }
}

class MinorPentatonicScale extends Scale {
    protected distances: ReadonlyArray<string> = ["b3", "2", "2", "b3", "2"];

    toString(): string {
        return `${this.root} minor pentatonic scale`;
    }
}

class BlueScale extends Scale {
    protected distances: ReadonlyArray<string> = ["b3", "2", "#1", "b2", "b3", "2"];
    protected descending_distances: ReadonlyArray<string> = ["b3", "2", "b2", "#1", "b3", "2"];

    toString(): string {
        return `${this.root} blue scale`;
    }
}

// Major modes
class DorianScale extends Scale {
    protected distances: ReadonlyArray<string> = ["2", "b2", "2", "2", "2", "b2", "2"];

    toString(): string {
        return `${this.root} dorian scale`;
    }
}

class PhrygianScale extends Scale {
    protected distances: ReadonlyArray<string> = ["b2", "2", "2", "2", "b2", "2", "2"];

    toString(): string {
        return `${this.root} phrygian scale`;
    }
}

class LydianScale extends Scale {
    protected distances: ReadonlyArray<string> = ["2", "2", "2", "b2", "2", "2", "b2"];

    toString(): string {
        return `${this.root} lydian scale`;
    }
}

class MixolydianScale extends Scale {
    protected distances: ReadonlyArray<string> = ["2", "2", "b2", "2", "2", "b2", "2"];

    toString(): string {
        return `${this.root} mixolydian scale`;
    }
}

class LocrianScale extends Scale {
    protected distances: ReadonlyArray<string> = ["b2", "2", "2", "b2", "2", "2", "2"];

    toString(): string {
        return `${this.root} locrian scale`;
    }
}

export {
    Scale,
    MajorScale,
    MinorScale,
    HarmonicScale,
    MelodicScale,
    MajorPentatonicScale,
    MinorPentatonicScale,
    BlueScale,
    DorianScale,
    PhrygianScale,
    LydianScale,
    MixolydianScale,
    LocrianScale,
};

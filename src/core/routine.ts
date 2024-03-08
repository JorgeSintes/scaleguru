import { Note } from "./notes";
import { allNotes, enharmonicNotes } from "./constants";
import { IScale, ScaleType, simplifyScale } from "./scales";

function shuffle(array: any[]): any[] {
    array = array.slice();
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

enum RoutineType {
    MantainScaleChangeKey = "Mantain scale, change key",
    MantainKeyChangeScale = "Mantain key, change scale",
    RandomScale = "Random scale",
}

interface RoutineConfig {
    randomizeKeys: boolean;
    scales: ScaleType[];
    randomizeScales: boolean;
    routineType: RoutineType;
    enharmonizeScales: boolean;
}

class Routine {
    config: RoutineConfig;
    routine: IScale[];
    keys: Note[];
    constructor(config: RoutineConfig) {
        this.checkConfig(config);
        this.config = config;
        this.routine = [];
        this.keys = this.config.enharmonizeScales ? enharmonicNotes : allNotes;
        this.generateRoutine();
    }
    checkConfig(config: RoutineConfig): void {
        if (config.scales.length === 0) {
            throw new Error("Scales cannot be empty");
        }
        if (
            config.routineType !== RoutineType.MantainScaleChangeKey &&
            config.routineType !== RoutineType.MantainKeyChangeScale &&
            config.routineType !== RoutineType.RandomScale
        ) {
            throw new Error("Invalid routine type");
        }
    }
    generateRoutine(): void {
        if (this.config.routineType === RoutineType.MantainScaleChangeKey) {
            let scales = this.config.randomizeScales ? shuffle(this.config.scales) : this.config.scales;
            for (const scale of scales) {
                let keys = this.config.randomizeKeys ? shuffle(this.keys) : this.keys;
                for (const key of keys) {
                    let newKey = key;
                    if (this.config.enharmonizeScales) {
                        newKey = simplifyScale(key, scale);
                    }
                    this.routine.push(new scale(newKey));
                }
            }
        } else if (this.config.routineType === RoutineType.MantainKeyChangeScale) {
            let keys = this.config.randomizeKeys ? shuffle(this.keys) : this.keys;
            for (const key of keys) {
                let scales = this.config.randomizeScales ? shuffle(this.config.scales) : this.config.scales;
                for (const scale of scales) {
                    let newKey = key;
                    if (this.config.enharmonizeScales) {
                        newKey = simplifyScale(key, scale);
                    }
                    this.routine.push(new scale(newKey));
                }
            }
        } else if (this.config.routineType === RoutineType.RandomScale) {
            let temp_routine: IScale[] = [];
            for (const key of this.keys) {
                for (const scale of this.config.scales) {
                    let newKey = key;
                    if (this.config.enharmonizeScales) {
                        newKey = simplifyScale(key, scale);
                    }
                    temp_routine.push(new scale(newKey));
                }
            }
            this.routine = shuffle(temp_routine);
        }
    }
    length(): number {
        return this.routine.length;
    }
    get_scale(index: number): IScale {
        return this.routine[index];
    }
}

export { RoutineType, RoutineConfig, Routine };

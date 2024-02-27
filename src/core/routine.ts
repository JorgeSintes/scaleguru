import { Note } from "./notes";
import { IScale, ScaleType } from "./scales";

function shuffle(array: any[]): any[] {
    array = array.slice();
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

enum RoutineType {
    MantainScaleChangeKey = 0,
    MantainKeyChangeScale = 1,
    RandomScale = 2,
}

interface RoutineConfig {
    keys: Note[];
    randomizeKeys: boolean;
    scales: ScaleType[];
    randomizeScales: boolean;
    routineType: RoutineType;
}

class Routine {
    config: RoutineConfig;
    routine: IScale[];
    constructor(config: RoutineConfig) {
        this.checkConfig(config);
        this.config = config;
        this.routine = [];
        this.generateRoutine();
    }
    checkConfig(config: RoutineConfig): void {
        if (config.keys.length === 0) {
            throw new Error("Keys cannot be empty");
        }
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
                let keys = this.config.randomizeKeys ? shuffle(this.config.keys) : this.config.keys;
                for (const key of keys) {
                    this.routine.push(new scale(key));
                }
            }
        } else if (this.config.routineType === RoutineType.MantainKeyChangeScale) {
            let keys = this.config.randomizeKeys ? shuffle(this.config.keys) : this.config.keys;
            for (const key of keys) {
                let scales = this.config.randomizeScales ? shuffle(this.config.scales) : this.config.scales;
                for (const scale of scales) {
                    this.routine.push(new scale(key));
                }
            }
        } else if (this.config.routineType === RoutineType.RandomScale) {
            let temp_routine: IScale[] = [];
            for (const key of this.config.keys) {
                for (const scale of this.config.scales) {
                    temp_routine.push(new scale(key));
                }
            }
            this.routine = shuffle(temp_routine);
        }
    }
    length(): number {
        return this.routine.length;
    }
    get(index: number): IScale {
        return this.routine[index];
    }
}

export { RoutineType, RoutineConfig, Routine };

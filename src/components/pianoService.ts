import { Piano } from "@tonejs/piano";
import * as Tone from "tone";
import { IScale } from "../core/scales";

export class PianoService {
    private static instance: PianoService;
    private piano: Piano;
    private isLoaded: boolean;
    private bpm: number;
    isPlaying: boolean;

    constructor() {
        this.piano = new Piano({ velocities: 4 });
        this.bpm = 60;
        this.isLoaded = false;
        this.isPlaying = false;
    }

    public async load(): Promise<PianoService> {
        if (!this.isLoaded) {
            await this.piano.toDestination().load();
            this.isLoaded = true;
        }
        return this;
    }

    public playScale(scale: IScale, afterPlay: () => void = () => {}): void {
        if (!this.isLoaded) {
            console.error("Piano not loaded");
            return;
        }
        if (!this.isPlaying) {
            // Scale notes
            var pattern = new Tone.Pattern(
                (time: number, note: string) => {
                    // Play note on the piano with defined velocity and duration
                    this.piano.keyDown({ note: note, velocity: 0.5, time: time });
                    this.piano.keyUp({ note: note, time: time + Tone.Time("4n").toSeconds() }); // assuming quarter note releases
                },
                scale.toPlayback(),
                "up"
            );

            pattern.iterations = scale.toPlayback().length;
            Tone.Transport.bpm.value = 120;
            Tone.start();
            pattern.start(0);
            Tone.Transport.start("+0.1");

            Tone.Transport.scheduleOnce(() => {
                this.stopPlayback();
                afterPlay();
            }, `+${(60 / Tone.Transport.bpm.value) * scale.toPlayback().length}`);
            this.isPlaying = true;
        }
    }

    public stopPlayback(): void {
        if (this.isPlaying) {
            Tone.Transport.stop();
            Tone.Transport.cancel(0);
            this.isPlaying = false;
        }
    }

    public getBpm(): number {
        return this.bpm;
    }

    public setBpm(bpm: number) {
        this.bpm = bpm;
    }
}

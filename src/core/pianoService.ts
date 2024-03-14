import { Piano } from "@tonejs/piano";
import { Pattern, Time, Transport, start } from "tone";
import { IScale } from "./scales";

export class PianoService {
    private static instance: PianoService;
    private piano: Piano;
    private isLoaded: boolean;
    private bpm: number;
    isPlaying: boolean;

    constructor() {
        this.piano = new Piano({
            velocities: 1,
            // minNote: 46,
            // maxNote: 70,
            // release: false,
            // pedal: false,
            // maxPolyphony: 1,
        });
        // this.piano = new Piano({ velocities: 4 });
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
            var pattern = new Pattern(
                (time: number, note: string) => {
                    // Play note on the piano with defined velocity and duration
                    this.piano.keyDown({ note: note, velocity: 0.5, time: time });
                    this.piano.keyUp({ note: note, time: time + Time("4n").toSeconds() }); // assuming quarter note releases
                },
                scale.toPlayback(),
                "up"
            );

            pattern.iterations = scale.toPlayback().length;
            Transport.bpm.value = 120;
            start();
            pattern.start(0);
            Transport.start("+0.1");

            Transport.scheduleOnce(() => {
                this.stopPlayback();
                afterPlay();
            }, `+${(60 / Transport.bpm.value) * scale.toPlayback().length}`);
            this.isPlaying = true;
        }
    }

    public stopPlayback(): void {
        if (this.isPlaying) {
            Transport.stop();
            Transport.cancel(0);
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

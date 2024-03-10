import { IScale } from "../../core/scales";
import { Piano } from "@tonejs/piano";
import * as Tone from "tone";

import "./playbackButton.css";

const playButtonIcon =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"/></svg>';

const stopButtonIcon =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M0 128C0 92.7 28.7 64 64 64H320c35.3 0 64 28.7 64 64V384c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128z"/></svg>';

export class PlaybackButton {
    rootElement: HTMLDivElement;
    piano: Piano;
    playButton: HTMLButtonElement;
    isPlaying: boolean = false;
    scale?: IScale;

    constructor(rootElement: HTMLDivElement) {
        this.rootElement = rootElement;
        this.playButton = rootElement.appendChild(document.createElement("button"));
        let loading = this.playButton.appendChild(document.createElement("div"));
        loading.ariaBusy = "true";
        loading.id = "loading";
        // this.playButton.disabled = true;
        this.playButton.id = "play-button";
        this.piano = new Piano({ velocities: 4 });
        this.piano.toDestination();
        this.piano.load().then(() => {
            this.playButton.removeAttribute("aria-busy");
            this.playButton.innerHTML = playButtonIcon;
            this.playButton.disabled = false;
            this.playButton.addEventListener("click", () => {
                if (!this.isPlaying) {
                    this.playScale();
                } else {
                    this.stopPlayback();
                }
            });
        });
    }

    playScale() {
        if (!this.scale) {
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
                this.scale.toPlayback(),
                "up"
            );

            pattern.iterations = this.scale.toPlayback().length;
            Tone.Transport.bpm.value = 120;
            Tone.start();
            pattern.start(0);
            Tone.Transport.start("+0.1");

            Tone.Transport.scheduleOnce(() => {
                this.stopPlayback();
            }, `+${(60 / Tone.Transport.bpm.value) * this.scale.toPlayback().length}`);
            this.playButton.innerHTML = stopButtonIcon;
            this.isPlaying = true;
        }
    }

    stopPlayback() {
        if (this.isPlaying) {
            Tone.Transport.stop();
            Tone.Transport.cancel(0);
            this.isPlaying = false;
            this.playButton.innerHTML = playButtonIcon;
        }
    }

    setScale(scale: IScale) {
        this.scale = scale;
    }
}

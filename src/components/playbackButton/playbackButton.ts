import { IScale } from "../../core/scales";
import { PianoService } from "../pianoService";

import "./playbackButton.css";

const playButtonIcon =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"/></svg>';

const stopButtonIcon =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M0 128C0 92.7 28.7 64 64 64H320c35.3 0 64 28.7 64 64V384c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128z"/></svg>';

export class PlaybackButton {
    rootElement?: HTMLDivElement;
    playButton: HTMLButtonElement;
    pianoService: PianoService;
    scale?: IScale;

    constructor() {
        this.playButton = document.createElement("button");
        let loading = this.playButton.appendChild(document.createElement("div"));
        loading.ariaBusy = "true";
        loading.id = "loading";
        // this.playButton.disabled = true;
        this.playButton.id = "play-button";
        this.pianoService = new PianoService();
        this.pianoService.load().then(() => {
            this.playButton.removeAttribute("aria-busy");
            this.playButton.innerHTML = playButtonIcon;
            this.playButton.disabled = false;
            this.playButton.addEventListener("click", () => {
                if (!this.pianoService.isPlaying) {
                    this.play();
                } else {
                    this.stop();
                }
            });
        });
    }

    render(rootElement: HTMLDivElement) {
        this.rootElement = rootElement;
        rootElement.appendChild(this.playButton);
    }

    play() {
        this.pianoService.playScale(this.scale!, () => {
            this.playButton.innerHTML = playButtonIcon;
        });
        this.playButton.innerHTML = stopButtonIcon;
    }

    stop() {
        this.pianoService.stopPlayback();
        this.playButton.innerHTML = playButtonIcon;
    }

    setScale(scale: IScale) {
        this.scale = scale;
    }

    isPlaying(): boolean {
        return this.pianoService.isPlaying;
    }
}

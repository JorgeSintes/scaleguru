import Vex from "vexflow";
import { Note } from "../../core/notes";
import { IScale } from "../../core/scales";
import { Routine } from "../../core/routine";

import "./scaleViewPractice.css";

const { Renderer, Stave } = Vex.Flow;

export class ScaleViewPractice {
    private rootElement?: HTMLDivElement;
    private scaleContainer?: HTMLDivElement;
    private routine: Routine;
    private renderer: any;
    private context: any;
    private idx: number;
    private title_element: any;
    private prev_button: any;
    private next_button: any;
    private scale_number: any;
    private close: () => void;

    constructor(routine: Routine, close: () => void) {
        this.routine = routine;
        this.close = close;
        this.idx = 0;
    }

    public render(rootElement: HTMLDivElement): void {
        this.rootElement = rootElement;
        this.initializeVexflow();
        this.drawScale();
    }

    private initializeVexflow(): void {
        if (!this.rootElement) {
            throw new Error("Root element is not defined");
        }
        const cardElement = this.rootElement.appendChild(document.createElement("article"));
        const title = cardElement.appendChild(document.createElement("header"));
        const backButton = title.appendChild(document.createElement("button"));
        backButton.innerHTML =
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/></svg>';
        backButton.id = "back-button";
        backButton.classList.add("secondary");
        backButton.onclick = () => {
            this.close();
        };
        this.title_element = title.appendChild(document.createElement("h3"));
        title.appendChild(document.createElement("div"));
        this.scaleContainer = cardElement.appendChild(document.createElement("div"));
        this.scaleContainer.classList.add("scale-container");
        // this.scaleContainer.style.visibility = "hidden";
        // this.context.setFont("Arial", 10, "").setBackgroundFillStyle("#eed");

        const footer = cardElement.appendChild(document.createElement("footer"));
        this.prev_button = footer.appendChild(document.createElement("button"));
        this.prev_button.classList.add("prev-button");
        this.prev_button.addEventListener("click", () => {
            this.prevScale();
        });
        this.prev_button.innerHTML = "Prev";
        this.prev_button.disabled = true;
        this.scale_number = footer.appendChild(document.createElement("div"));
        this.scale_number.innerHTML = `Scale ${this.idx + 1}/${this.routine.length()}`;
        this.next_button = footer.appendChild(document.createElement("button"));
        this.next_button.classList.add("next-button");
        this.next_button.addEventListener("click", () => {
            this.nextScale();
        });
        this.next_button.innerHTML = "Next";
    }

    private drawScale(): void {
        if (!this.scaleContainer) {
            throw new Error("Root element is not defined");
        }
        this.scaleContainer.innerHTML = "";
        const scale = this.routine.get_scale(this.idx);
        this.title_element.innerHTML = `${scale.getName()}`;
        this.renderer = new Renderer(this.scaleContainer, Renderer.Backends.SVG);
        this.renderer.resize(this.scaleContainer.clientWidth, 200);
        this.context = this.renderer.getContext();
        const notes = scale.toVexflow();
        const staveWidth = Math.min(500, this.scaleContainer.clientWidth - 40);
        const staveStartX = (this.scaleContainer.clientWidth - staveWidth) / 2;
        const stave = new Stave(staveStartX, 40, staveWidth);
        stave.addClef("treble").setContext(this.context).draw();

        const voice = new Vex.Flow.Voice({ num_beats: notes.length, beat_value: 4 });
        voice.addTickables(notes);

        new Vex.Flow.Formatter().joinVoices([voice]).format([voice], staveWidth - 50);
        voice.draw(this.context, stave);

        const svgElement = this.scaleContainer.querySelector("svg");
        if (svgElement) {
            svgElement.id = "scale-svg";
        }

        const show_button = this.scaleContainer.appendChild(document.createElement("button"));
        show_button.id = "show-button";
        show_button.classList.add("outline");
        show_button.classList.add("contrast");
        show_button.innerHTML =
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--! Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2023 Fonticons, Inc. --><path d="M288 80c-65.2 0-118.8 29.6-159.9 67.7C89.6 183.5 63 226 49.4 256c13.6 30 40.2 72.5 78.6 108.3C169.2 402.4 222.8 432 288 432s118.8-29.6 159.9-67.7C486.4 328.5 513 286 526.6 256c-13.6-30-40.2-72.5-78.6-108.3C406.8 109.6 353.2 80 288 80zM95.4 112.6C142.5 68.8 207.2 32 288 32s145.5 36.8 192.6 80.6c46.8 43.5 78.1 95.4 93 131.1c3.3 7.9 3.3 16.7 0 24.6c-14.9 35.7-46.2 87.7-93 131.1C433.5 443.2 368.8 480 288 480s-145.5-36.8-192.6-80.6C48.6 356 17.3 304 2.5 268.3c-3.3-7.9-3.3-16.7 0-24.6C17.3 208 48.6 156 95.4 112.6zM288 336c44.2 0 80-35.8 80-80s-35.8-80-80-80c-.7 0-1.3 0-2 0c1.3 5.1 2 10.5 2 16c0 35.3-28.7 64-64 64c-5.5 0-10.9-.7-16-2c0 .7 0 1.3 0 2c0 44.2 35.8 80 80 80zm0-208a128 128 0 1 1 0 256 128 128 0 1 1 0-256z"/></svg>';
        show_button.innerHTML += "Show me the scale";
        show_button.onclick = () => {
            const svg = document.getElementById("scale-svg");
            if (svg) {
                svg.style.transition = "filter 0.2s";
                svg.style.filter = "none";
            }
            const button = document.getElementById("show-button");
            if (button) {
                button.style.display = "none";
            }
        };
    }

    private prevScale(): void {
        if (this.idx > 0) {
            this.idx--;
            this.drawScale();
        }
        if (this.idx === 0) {
            this.prev_button.disabled = true;
        }
        if (this.next_button.disabled) {
            this.next_button.disabled = false;
        }
        this.scale_number.innerHTML = `Scale ${this.idx + 1}/${this.routine.length()}`;
    }

    private nextScale(): void {
        if (this.idx < this.routine.length() - 1) {
            this.idx++;
            this.drawScale();
        }
        if (this.idx === this.routine.length() - 1) {
            this.next_button.disabled = true;
        }
        if (this.prev_button.disabled) {
            this.prev_button.disabled = false;
        }
        this.scale_number.innerHTML = `Scale ${this.idx + 1}/${this.routine.length()}`;
    }

    destroy() {
        if (this.rootElement) {
            this.rootElement.innerHTML = "";
        }
    }
}

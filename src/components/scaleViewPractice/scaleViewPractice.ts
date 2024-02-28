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
        backButton.innerHTML = "Back";
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

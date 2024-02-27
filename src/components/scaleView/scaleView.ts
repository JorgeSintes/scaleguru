import Vex from "vexflow";
import { Note } from "../../core/notes";
import { ScaleType } from "../../core/scales";

import "./scaleView.css";

const { Renderer, Stave } = Vex.Flow;

export class ScaleView {
    private rootElement?: HTMLDivElement;
    private scaleContainer?: HTMLDivElement;
    private root: Note;
    private scale: ScaleType;
    private renderer: any;
    private context: any;

    constructor(root: Note, scale: ScaleType) {
        this.root = root;
        this.scale = scale;
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
        title.innerHTML = `<h3>${this.root.toString()} ${this.scale.toString()}</h3>`;
        this.scaleContainer = cardElement.appendChild(document.createElement("div"));
        this.scaleContainer.classList.add("scale-container");
        this.renderer = new Renderer(this.scaleContainer, Renderer.Backends.SVG);
        this.renderer.resize(this.scaleContainer.clientWidth, 200);
        this.context = this.renderer.getContext();
        // this.context.setFont("Arial", 10, "").setBackgroundFillStyle("#eed");
    }

    private drawScale(): void {
        if (!this.scaleContainer) {
            throw new Error("Root element is not defined");
        }
        const notes = new this.scale(this.root).toVexflow();
        const staveWidth = Math.min(500, this.scaleContainer.clientWidth - 40);
        const staveStartX = (this.scaleContainer.clientWidth - staveWidth) / 2;
        const stave = new Stave(staveStartX, 40, staveWidth);
        stave.addClef("treble").setContext(this.context).draw();

        const voice = new Vex.Flow.Voice({ num_beats: notes.length, beat_value: 4 });
        voice.addTickables(notes);

        new Vex.Flow.Formatter().joinVoices([voice]).format([voice], staveWidth - 50);
        voice.draw(this.context, stave);
    }

    private emtpyScale(): void {
        if (this.rootElement) {
            this.rootElement.innerHTML = "";
        }
    }

    public updateComponent(newElement: Note | ScaleType): void {
        if (newElement instanceof Note) {
            this.root = newElement;
        } else {
            this.scale = newElement;
        }
        if (this.rootElement) {
            this.emtpyScale();
            this.initializeVexflow();
            this.drawScale();
        }
    }
}

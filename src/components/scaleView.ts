import { Vex } from "vexflow";
import { Note } from "../core/notes";
import { ScaleType } from "../core/scales";

const { Renderer, Stave } = Vex.Flow;

export class ScaleView {
    private rootElement?: HTMLDivElement;
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
        this.renderer = new Renderer(this.rootElement, Renderer.Backends.SVG);
        this.renderer.resize(500, 200);
        this.context = this.renderer.getContext();
        // this.context.setFont("Arial", 10, "").setBackgroundFillStyle("#eed");
    }

    private drawScale(): void {
        const notes = new this.scale(this.root).toVexflow();
        const stave = new Stave(10, 40, 400);
        stave.addClef("treble").setContext(this.context).draw();

        const voice = new Vex.Flow.Voice({ num_beats: notes.length, beat_value: 4 });
        voice.addTickables(notes);

        new Vex.Flow.Formatter().joinVoices([voice]).format([voice], 350);
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

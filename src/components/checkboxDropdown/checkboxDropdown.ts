import { Note } from "../../core/notes";
import { ScaleType } from "../../core/scales"; // Adjust the path as necessary
import { RoutineType } from "../../core/routine";
import "./checkboxDropdown.css";

type Options = Array<Note | ScaleType | string>;

export class CheckboxDropdown {
    private rootElement?: HTMLElement;
    private title: string;
    private options: Options;
    private selectedOptions: Options;
    private onSelectionChange: (selectedOptions: Options) => void;
    private checkboxes: HTMLInputElement[] = [];

    constructor(
        title: string,
        options: Options,
        onSelectionChange: (selectedOptions: Options) => void,
        defaultOption: Options
    ) {
        this.title = title;
        this.options = options;
        this.selectedOptions = defaultOption;
        this.onSelectionChange = onSelectionChange;
    }
    public render(rootElement: HTMLElement): void {
        this.rootElement = rootElement;
        this.createCheckboxes();
    }
    createCheckboxes(): void {
        if (!this.rootElement) {
            throw new Error("Root element is not defined");
        }

        const checkboxDiv = document.createElement("div");
        checkboxDiv.classList.add("checkbox-dropdown");

        const dropwdown = checkboxDiv.appendChild(document.createElement("details"));
        dropwdown.classList.add("dropdown");
        dropwdown.appendChild(document.createElement("summary")).innerText = this.title;
        const list = dropwdown.appendChild(document.createElement("ul"));
        for (const option of this.options) {
            const listItem = list.appendChild(document.createElement("li"));
            const label = listItem.appendChild(document.createElement("label"));
            const checkbox = label.appendChild(document.createElement("input"));
            checkbox.type = "checkbox";
            checkbox.value = option.toString();
            checkbox.name = option.toString();
            checkbox.defaultChecked = this.selectedOptions.includes(option);
            checkbox.addEventListener("change", () => {
                this.handleCheckboxChange(checkbox, option);
            });
            checkbox.after(option.toString());
            this.checkboxes.push(checkbox);
        }
        this.rootElement.appendChild(checkboxDiv);
    }

    handleCheckboxChange(checkbox: HTMLInputElement, option: Note | ScaleType | string): void {
        if (checkbox.checked) {
            this.selectedOptions.push(option);
        } else {
            this.selectedOptions = this.selectedOptions.filter((selectedOption) => selectedOption !== option);
        }
        this.onSelectionChange(this.selectedOptions);
        if (this.rootElement) {
            localStorage.setItem(`${this.rootElement?.id}-default`, this.selectedOptions.toString());
        }
    }

    public getSelectedOptions(): Options {
        return this.options.filter((option) => this.selectedOptions.includes(option));
    }
    public setSelectedOptions(selectedOptions: Options): void {
        this.selectedOptions = selectedOptions;
        if (this.checkboxes.length > 0) {
            this.checkboxes.forEach((checkbox) => {
                checkbox.checked =
                    this.selectedOptions.filter(
                        (selectedOption) => selectedOption.toString() === checkbox.value
                    ).length > 0;
            });
        }
        if (this.rootElement) {
            localStorage.setItem(`${this.rootElement?.id}-default`, this.selectedOptions.toString());
        }
    }
}

export { Options };

import { Note } from "../../core/notes";
import { ScaleType } from "../../core/scales"; // Adjust the path as necessary
import { RoutineType } from "../../core/routine";

import "./comboBox.css";

type Option = Note | ScaleType | RoutineType | string;

export class ComboBox {
    private rootElement?: HTMLElement;
    private title: string;
    private options: Option[];
    private selectedOption: Option;
    private onSelectionChange: (selectedOption: Option) => void;

    constructor(
        title: string,
        options: Option[],
        onSelectionChange: (selectedOption: Option) => void,
        defaultOption: Option
    ) {
        this.title = title;
        this.options = options;
        this.selectedOption = defaultOption;
        this.onSelectionChange = onSelectionChange;
    }

    public render(rootElement: HTMLElement): void {
        this.rootElement = rootElement;
        this.createComboBox();
    }

    private createComboBox(): void {
        if (!this.rootElement) {
            throw new Error("Root element is not defined");
        }

        const comboBoxDiv = document.createElement("div");
        comboBoxDiv.classList.add("combobox");

        const title = comboBoxDiv.appendChild(document.createElement("label"));
        title.innerText = this.title;

        const select = document.createElement("select");
        select.name = "Select:";
        select.ariaLabel = "Select:";

        // Populate the dropdown with the options
        this.options.forEach((option) => {
            const optionName = option.toString();
            const optionElement = document.createElement("option");
            optionElement.innerText = optionName;
            if (option === this.selectedOption) {
                optionElement.selected = true;
            }
            select.appendChild(optionElement);
        });
        select.onchange = (event) => {
            const selectedIndex = select.selectedIndex;
            this.selectedOption = this.options[selectedIndex];
            if (this.rootElement) {
                localStorage.setItem(`${this.rootElement.id}-default`, this.selectedOption.toString());
            }
            this.onSelectionChange(this.selectedOption); // Call the callback with the selected scale
        };
        // Append elements
        comboBoxDiv.appendChild(select);
        this.rootElement.appendChild(comboBoxDiv);
    }

    public getSelectedOption(): Option {
        return this.selectedOption; // Return the currently selected scale class
    }
}

export { Option };

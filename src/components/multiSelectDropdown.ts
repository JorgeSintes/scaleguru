abstract class MultiSelectDropdownOptions {
    abstract toString(): string;
}
export class MultiSelectDropdown {
    private rootElement?: HTMLElement;
    private selectDiv?: HTMLDivElement;
    private options: MultiSelectDropdownOptions[];

    constructor(options: MultiSelectDropdownOptions[]) {
        this.options = options;
    }

    public render(rootElement: HTMLElement): void {
        this.rootElement = rootElement;
        this.createDropdown();
    }

    private createDropdown(): void {
        if (!this.rootElement) {
            throw new Error("Root element is not defined");
        }
        this.selectDiv = document.createElement("div");
        this.selectDiv.classList.add("dropdown");

        const selectButton = document.createElement("button");
        selectButton.textContent = "Select Options";
        selectButton.classList.add("dropdown-button");

        const optionsList = document.createElement("div");
        optionsList.classList.add("dropdown-content");

        this.options.forEach((option) => {
            const label = document.createElement("label");
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.value = option.toString();
            label.appendChild(checkbox);
            label.append(option.toString());
            optionsList.appendChild(label);
        });

        this.selectDiv.appendChild(selectButton);
        this.selectDiv.appendChild(optionsList);

        selectButton.onclick = () => {
            optionsList.classList.toggle("show");
        };

        this.rootElement.appendChild(this.selectDiv);
    }
    public addEventListener(event: string, callback: (event: any) => void): void {
        if (!this.selectDiv) {
            throw new Error("render() must be called before adding event listeners.");
        }
        this.selectDiv.addEventListener(event, callback);
    }
}

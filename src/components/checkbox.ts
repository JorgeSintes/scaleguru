interface CheckboxState {
    value: boolean;
    disabled: boolean;
}

export class Checkbox {
    rootElement?: HTMLElement;
    checkboxId: string;
    name: string;
    value: boolean;
    disabled: boolean;
    onSelectionChange: (value: boolean) => void;

    constructor(
        checkboxId: string,
        name: string,
        value: boolean,
        disabled: boolean = false,
        onSelectionChange: (value: boolean) => void = () => {}
    ) {
        this.checkboxId = checkboxId;
        this.name = name;
        this.value = value;
        this.disabled = disabled;
        this.onSelectionChange = onSelectionChange;
    }

    public render(rootElement: HTMLElement): void {
        this.rootElement = rootElement;
        this.fromLocalStorage();
        this.createCheckbox();
    }

    fromLocalStorage(): void {
        const state = localStorage.getItem(this.checkboxId);
        if (state) {
            const checkboxState: CheckboxState = JSON.parse(state);
            this.value = checkboxState.value;
            this.disabled = checkboxState.disabled;
        }
    }

    saveLocalStorage(): void {
        const state = JSON.stringify({
            value: this.value,
            disabled: this.disabled,
        });
        localStorage.setItem(this.checkboxId, state);
    }

    createCheckbox(): void {
        if (!this.rootElement) {
            throw new Error("Root element is not defined");
        }

        const checkboxDiv = document.createElement("div");
        checkboxDiv.classList.add("checkbox-practice");
        const label = checkboxDiv.appendChild(document.createElement("label"));
        const checkbox = label.appendChild(document.createElement("input"));
        checkbox.type = "checkbox";
        checkbox.checked = this.value;
        checkbox.addEventListener("change", () => {
            this.handleCheckboxChange(checkbox);
        });
        checkbox.after(this.name);
        if (this.disabled) {
            checkbox.disabled = true;
            label.ariaDisabled = "true";
        }
        this.rootElement.appendChild(checkboxDiv);
    }

    handleCheckboxChange(checkbox: HTMLInputElement): void {
        if (checkbox.checked) {
            this.value = true;
        } else {
            this.value = false;
        }
        this.onSelectionChange(this.value);
        if (this.rootElement) {
            localStorage.setItem(`${this.rootElement?.id}-default`, this.value.toString());
        }
        this.saveLocalStorage();
    }

    public getValue(): boolean {
        return this.value;
    }

    public setValue(value: boolean): void {
        this.value = value;
        if (this.rootElement) {
            let checkbox = this.rootElement.querySelector("input") as HTMLInputElement;
            checkbox.checked = value;
        }
        this.saveLocalStorage();
    }

    public disableCheckbox(): void {
        this.disabled = true;
        if (this.rootElement) {
            this.rootElement.querySelectorAll("input").forEach((input) => {
                input.disabled = true;
            });
            this.rootElement.querySelectorAll("label").forEach((label) => {
                label.ariaDisabled = "true";
            });
        }
        this.saveLocalStorage();
    }

    public enableCheckbox(): void {
        this.disabled = false;
        if (this.rootElement) {
            this.rootElement.querySelectorAll("input").forEach((input) => {
                input.disabled = false;
            });
            this.rootElement.querySelectorAll("label").forEach((label) => {
                label.ariaDisabled = "";
            });
        }
        this.saveLocalStorage();
    }
}

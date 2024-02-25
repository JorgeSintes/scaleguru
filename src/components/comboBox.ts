import { Note } from "../core/notes";
import { ScaleType, MajorScale } from "../core/scales"; // Adjust the path as necessary

type Option = Note | ScaleType;

export class ComboBox {
    private rootElement?: HTMLElement;
    private options: Option[];
    private selectedOption: Option;
    private onSelectionChange: (selectedOption: Option) => void;

    constructor(
        options: Option[],
        onSelectionChange: (selectedOption: Option) => void,
        defaultOption: Option,
    ) {
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

        // Create the select element
        const selectDiv = document.createElement("div");
        selectDiv.classList.add("relative");

        // Create the button for the ComboBox
        const button = document.createElement("button");
        button.classList.add(
            "bg-gray-200",
            "text-gray-700",
            "rounded",
            "px-4",
            "py-2",
            "text-sm",
            "focus:outline-none",
            "focus:shadow-outline",
        );
        button.innerText = this.selectedOption.toString(); // Display the default scale

        button.onclick = () => {
            dropdown.classList.toggle("hidden");
        };

        // Create the dropdown menu
        const dropdown = document.createElement("div");
        dropdown.classList.add(
            "absolute",
            "z-10",
            "hidden",
            "bg-white",
            "mt-2",
            "py-2",
            "w-full",
            "rounded",
            "shadow-xl",
        );

        // Populate the dropdown with the options
        this.options.forEach((option) => {
            const optionName = option.toString();
            const item = document.createElement("a");
            item.href = "#";
            item.classList.add("block", "px-4", "py-2", "text-sm", "text-gray-800", "hover:bg-gray-200");
            item.innerText = optionName;
            item.onclick = (event) => {
                event.preventDefault();
                this.selectedOption = option; // Update the currently selected scale with the one clicked
                button.innerText = optionName; // Update button text with selection
                dropdown.classList.add("hidden"); // Hide dropdown after selection
                this.onSelectionChange(this.selectedOption); // Call the callback with the selected scale
            };
            dropdown.appendChild(item);
        });

        // Append elements
        selectDiv.appendChild(button);
        selectDiv.appendChild(dropdown);
        this.rootElement.appendChild(selectDiv);
    }

    public getSelectedOption(): Option {
        return this.selectedOption; // Return the currently selected scale class
    }
}

export function preventEmptySearch(form: HTMLFormElement | null,input: HTMLInputElement | null,errorMessage = "Escriba el nombre de un país para buscar.",
): void {
    if (!form || !input) return;
    form.addEventListener("submit", (event: SubmitEvent): void => {
        const isEmpty = input.value.trim() === "";

        if (isEmpty) {
            event.preventDefault();
            input.setCustomValidity(errorMessage);
            input.reportValidity();
            input.focus();
        }
    });

    input.addEventListener("input", (): void => {
        if (input.validationMessage) {
            input.setCustomValidity("");
        }
    });
}
export const gestionKeyBoard = () => {
    document.body.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            let element = document.getElementById("message-input");
            if (element != null) {
                element.click();
            }
        }
    });
}


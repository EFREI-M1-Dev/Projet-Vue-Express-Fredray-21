export const gestionKeyBoard = (sendMsg) => {
    let isKeyboardListenerAdded = false;

    const addKeyboardListener = () => {
        if (!isKeyboardListenerAdded) {
            document.body.addEventListener("keydown", handleKeyDown);
            isKeyboardListenerAdded = true;
        }
    };

    const removeKeyboardListener = () => {
        document.body.removeEventListener("keydown", handleKeyDown);
        isKeyboardListenerAdded = false;
    };

    const handleKeyDown = (e) => {
        if (window.location.pathname !== "/") return;
        let element = document.getElementById("message-input") as HTMLInputElement;
        if (e.key === "Enter") {
            if (element != null) {
                if (document.activeElement.tagName.toLowerCase() !== 'input' && document.activeElement !== element) {
                    e.preventDefault();
                    element.focus();
                } else {
                    sendMsg();
                }
            }
        }

        if (e.key.length === 1) {
            if (element != null) {
                if (document.activeElement.tagName.toLowerCase() !== 'input' && document.activeElement !== element) {
                    element.focus();
                }
            }
        }
    };

    return {addKeyboardListener, removeKeyboardListener};
};

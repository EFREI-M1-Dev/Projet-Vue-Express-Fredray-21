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
        if (e.key === "Enter") {
            if (window.location.pathname !== "/") return;
            e.preventDefault();
            let element = document.getElementById("message-input");
            if (element != null) {
                if (document.activeElement !== element) {
                    element.focus();
                } else {
                    sendMsg();
                }
            }
        }
    };

    return { addKeyboardListener, removeKeyboardListener };
};

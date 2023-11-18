let isKeyboardListenerAdded = false;

export const gestionKeyBoard = (sendMsg) => {
    if (!isKeyboardListenerAdded) {
        document.body.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                if(window.location.pathname !== "/") return;
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
        });

        isKeyboardListenerAdded = true;
    }
};

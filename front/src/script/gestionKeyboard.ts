export const gestionKeyBoard = (sendMsg) => {
    document.body.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            let element = document.getElementById("message-input");
            if (element != null ) {
                if(document.activeElement !== element) {
                    element.focus();
                } else {
                    sendMsg();
                }
            }
        }
    });
}
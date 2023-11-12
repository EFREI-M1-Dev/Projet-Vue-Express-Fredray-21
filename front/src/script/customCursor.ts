export default function initializeCustomCursor() {
    document.addEventListener('mousemove', (e) => {
        const cursor = document.querySelector('.custom-cursor') as HTMLElement;

        if (cursor) {
            // Calcul de la vitesse en fonction des déplacements du curseur
            const dx = e.pageX - cursor.offsetLeft;
            const dy = e.pageY - cursor.offsetTop;
            const speed = Math.sqrt(dx * dx + dy * dy);

            // Mise à jour de la position du curseur noir en fonction de la vitesse
            cursor.style.top = e.pageY + 'px';
            cursor.style.left = e.pageX + 'px';

            // Vérifier si le curseur survole un élément de type lien (<a>) ou d'entrée (<input>)
            if (e.target instanceof Element) {
                if (e.target.tagName === 'A' || e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON') {
                    cursor.classList.add('hovered');
                } else {
                    cursor.classList.remove('hovered');
                }
            }
        }
    });
}
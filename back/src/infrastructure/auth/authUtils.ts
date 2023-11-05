import jwt from 'jsonwebtoken';
import { User } from '../../user/User';

// Clé secrète pour signer le jeton (devrait être stockée en toute sécurité)
const secretKey = 'votre_clé_secrète';

export const generateAuthToken = (user: User) => {
    // Créez un jeton avec les informations de l'utilisateur (vous pouvez ajouter d'autres données si nécessaire)
    const token = jwt.sign({ userId: user.getId(), username: user.getUsername() }, secretKey, {
        expiresIn: '1h', // Durée de validité du jeton (par exemple, 1 heure)
    });

    return token;
}


import jwt from 'jsonwebtoken';
import { User } from '../../user/User';
import { Request, Response, NextFunction } from 'express';

// Clé secrète pour signer le jeton (devrait être stockée en toute sécurité)
const secretKey = 'maSuperCléeSecrete';

export const generateAuthToken = (user: User) => {
    // Créez un jeton avec les informations de l'utilisateur (vous pouvez ajouter d'autres données si nécessaire)
    const token = jwt.sign({username: user.getUsername() }, secretKey, {
        expiresIn: '1h', // Durée de validité du jeton (par exemple, 1 heure)
    });

    return token;
}

export const verifyTokenMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token: string | undefined = req.headers.authorization;

    console.log('token', token);
    if (!token) {
        return res.status(401).json({ message: 'Jetons d\'authentification manquant' });
    }

    // Vérifiez si le jeton commence par "Bearer " (avec l'espace)
    if (!token.startsWith("Bearer ")) {
        return res.status(401).json({ message: 'Format de jeton d\'authentification invalide' });
    }

    // Supprimez le préfixe "Bearer " pour obtenir le jeton réel
    const jwtToken = token.replace("Bearer ", "");

    jwt.verify(jwtToken, secretKey, (err, verified) => {
        if (err) {
            return res.status(401).json({ message: 'Jeton d\'authentification invalide' });
        }
        // Le jeton est valide. Vous pouvez ajouter les informations utilisateur décodées à l'objet de requête.
        req.user = verified;
        next();
    });
};

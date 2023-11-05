import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import * as bcrypt from 'bcrypt';
import { User } from '../../user/User';
import { UserService } from '../../user/UserService';

export const configurePassport = (userService: UserService) => {
    passport.use(new LocalStrategy(
        async (username, password, done) => {
            try {
                // Recherchez l'utilisateur dans la base de données en utilisant UserService.
                const user = await userService.findUserByUsername(username);

                if (!user) {
                    return done(null, false, {message: 'Nom d\'utilisateur incorrect'});
                }

                // password de test : passWord-1

                // Vérifiez le mot de passe en utilisant bcrypt.
                const passwordMatch = await bcrypt.compare(password, user.getPassword());

                if (!passwordMatch) {
                    return done(null, false, {message: 'Mot de passe incorrect'});
                }

                return done(null, user);
            } catch (err) {
                return done(err);
            }
        }
    ));

    passport.serializeUser((user: User, done) => {
        done(null, user.getId());
    });

    passport.deserializeUser((id: number, done) => {
        // Chargez l'utilisateur depuis la base de données en utilisant UserService.
        userService.getById(id)
            .then(user => {
                done(null, user);
            })
            .catch(err => {
                done(err);
            });
    });
}

export default passport;

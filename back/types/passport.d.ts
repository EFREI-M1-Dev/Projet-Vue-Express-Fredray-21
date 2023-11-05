import { User } from '../user/User';

declare module 'passport' {
    interface Authenticator<InitializeRet = void, AuthenticateRet = void, AuthorizeRet = void, AuthorizeOptions = void> {
        serializeUser<TUser, TID>(fn: (user: User, done: (err: any, id?: TID) => void) => void): void;
    }
}


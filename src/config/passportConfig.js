import passport from 'passport';
import GitHubStrategy from 'passport-github2';
import userModel from '../dao/models/userModel.js';
import UserService from '../dao/services/user/userService.js';

const User = new UserService();

const initializePassport = () =>{

    passport.use(
        'github',
        new GitHubStrategy({
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.SECRET_ID,
            callbackURL: 'http://localhost:8080/api/sessions/githubcallback'
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await User.findOne({githubId: profile.id})
            if(!user) {
                let email = profile._json.email || `default${profile.id}@email.com`;
                user = await User.findOne({email: email});
                if(!user) {
                    let newUser = {
                        githubId: profile.id,
                        first_name: profile._json.name.split(' ')[0],
                        last_name: profile._json.name.split(' ')[1],
                        email: email,
                        password: ''
                    }
                    let result = await User.createUser(newUser);
                    done(null, result);
                } else {
                    done(null, user);
                }
            } else {
                done(null, user);
            }
        } catch(error) {
            return done(error);
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });
    passport.deserializeUser(async (id, done) => {
        let user = await userModel.findById(id);
        done(null, user);
    });
};

export default initializePassport;
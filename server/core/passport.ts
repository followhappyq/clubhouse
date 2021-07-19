import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github";
import { user } from "../../models";

passport.use(
  "github",
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:3001/auth/github/callback",
    },
    async (_: unknown, __: unknown, profile, done) => {
      try {
        const obj = {
          fullname: profile.displayName,
          isActive: 0,
          username: profile.username,
          phone: "",
          avatarUrl: profile.photos?.[0].value,
        };

        const findUser = await user.findOne({
          where: {
            username: obj.username,
          },
        });

        if (!findUser) {
          const newUser = await user.create(obj);
          return done(null, newUser.toJSON());
        }

        done(null, findUser);
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  user.findById(id, function (err, user) {
    err ? done(err) : done(null, user);
  });
});

export { passport };

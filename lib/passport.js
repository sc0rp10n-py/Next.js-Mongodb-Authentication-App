import passport from 'passport';
import bcrypt from 'bcryptjs';
import { Strategy as LocalStrategy } from 'passport-local';
import { ObjectId } from 'mongodb';

passport.serializeUser((user, done) => {
  // console.log('1');
  done(null, user._id.toString());
});

// passport#160
passport.deserializeUser((req, id, done) => {
  // console.log('2');
  req.db
    .collection('users')
    .findOne(ObjectId(id))
    .then((user) => done(null, user));
    // console.log('3');
});

passport.use(
  new LocalStrategy(
    { usernameField: 'email', passReqToCallback: true },
    async (req, email, password, done) => {
      const user = await req.db.collection('users').findOne({ email });
      if (user && (await bcrypt.compare(password, user.password))) done(null, user);
      else done(null, false)
    },
  ),
);
// console.log('4');

export default passport;
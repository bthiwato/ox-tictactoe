import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (e) {
    done(e as any);
  }
});

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  callbackURL: process.env.GOOGLE_CALLBACK_URL!
}, async (_accessToken, _refreshToken, profile, done) => {
  try {
    const providerId = profile.id;
    const email = profile.emails?.[0]?.value;
    const photo = profile.photos?.[0]?.value;

    let user = await prisma.user.findUnique({ where: { providerId } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          provider: 'google',
          providerId,
          displayName: profile.displayName || 'No Name',
          email,
          photoUrl: photo || undefined
        }
      });
    }
    return done(null, user);
  } catch (e) {
    return done(e as any);
  }
}));

export default passport;
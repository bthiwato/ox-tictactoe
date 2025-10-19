import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import cors from 'cors';
import passport from './auth';
import gameRoutes from './gameRoutes';
import userRoutes from './userRoutes';

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false, // set true when HTTPS
    sameSite: 'lax'
  }
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', passport.authenticate('google', {
  failureRedirect: `${process.env.CLIENT_URL}/?auth=failed`,
  successRedirect: `${process.env.CLIENT_URL}/`
}));

app.post('/auth/logout', (req: any, res) => {
  req.logout(() => {
    req.session.destroy(() => res.json({ ok: true }));
  });
});

app.use('/api/game', gameRoutes);
app.use('/api', userRoutes);

const port = Number(process.env.PORT || 4000);
app.listen(port, () => console.log(`Backend listening on http://localhost:${port}`));
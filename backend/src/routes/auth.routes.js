import express from 'express';
import {
  register,
  login,
  logout,
  refresh,
  session,
} from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/refresh', refresh);
router.get('/session', session);
export default router;

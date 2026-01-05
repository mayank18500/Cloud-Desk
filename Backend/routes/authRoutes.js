import express from 'express';
import { register, login } from '../controllers/authController.js';
import { uploadMixed } from '../middleware/multer.js';

const router = express.Router();

router.post('/register', uploadMixed.fields([
    { name: 'cv', maxCount: 1 },
    { name: 'avatar', maxCount: 1 }
]), register);

router.post('/login', login);

export default router;

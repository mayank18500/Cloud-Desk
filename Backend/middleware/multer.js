import multer from 'multer';
import {
    avatarStorage,
    cvStorage,
    mixedStorage,
} from '../config/cloudinaryConfig.js';

export const uploadAvatar = multer({ storage: avatarStorage });
export const uploadCV = multer({ storage: cvStorage });
export const uploadMixed = multer({ storage: mixedStorage });

import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// AVATAR STORAGE (IMAGES)
export const avatarStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'clouddesk/avatars',
        resource_type: 'image',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    },
});

// CV STORAGE (PDF ONLY)
export const cvStorage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => ({
        folder: 'clouddesk/cvs',
        resource_type: 'raw',
        format: 'pdf',
        public_id: `${Date.now()}-${file.originalname
            .replace(/\.[^/.]+$/, '')
            .replace(/\s+/g, '_')}`,
    }),
});

// MIXED STORAGE (Used for Registration and Profile Update)
// Dynamically routes files to the correct specialized folders
export const mixedStorage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
        const isCV = file.fieldname === 'cv' || /\.(pdf|doc|docx)$/i.test(file.originalname);

        if (isCV) {
            return {
                folder: 'clouddesk/cvs',
                resource_type: 'raw',
                format: 'pdf',
                public_id: `${Date.now()}-${file.originalname
                    .replace(/\.[^/.]+$/, '')
                    .replace(/\s+/g, '_')}`,
            };
        }

        return {
            folder: 'clouddesk/avatars',
            resource_type: 'image',
            allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
            public_id: `${Date.now()}-${file.originalname
                .replace(/\.[^/.]+$/, '')
                .replace(/\s+/g, '_')}`,
        };
    },
});

export default cloudinary;

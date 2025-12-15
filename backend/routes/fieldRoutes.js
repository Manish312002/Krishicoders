import express from 'express';
import { getFields, createField, updateField, deleteField } from '../controllers/fieldController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(protect, getFields)
    .post(protect, createField);

router.route('/:id')
    .put(protect, updateField)
    .delete(protect, deleteField);

export default router;

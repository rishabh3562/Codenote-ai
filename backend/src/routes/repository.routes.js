import express from 'express';
import {
  getRepositories,
  getRepository,
  createRepository,
  updateRepository,
  deleteRepository,
} from '../controllers/repository.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.route('/').get(getRepositories).post(createRepository);

router
  .route('/:id')
  .get(getRepository)
  .put(updateRepository)
  .delete(deleteRepository);

export default router;

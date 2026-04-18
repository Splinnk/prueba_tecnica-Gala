import { Router } from 'express';
import { PostController } from '../controllers/post.controller';

const router = Router();

router.get('/', PostController.getAllPosts);
// router.post('/', PostController.createPost);
// router.get('/:identifier', PostController.getPost);
// router.put('/:id', PostController.updatePost);
// router.delete('/:id', PostController.deletePost);

export default router;
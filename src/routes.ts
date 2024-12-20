import { Router } from 'express';
import { userRouter } from './api/user/userRouter';
import { blogRouter } from './api/blog/blogRouter';
import { verifyAdmin } from './common/middleware/auth';

const router = Router();

router.use('/user', userRouter);
router.use('/blog', blogRouter);

export default router;
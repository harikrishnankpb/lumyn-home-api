import { Router } from 'express';
import { userRouter } from './api/user/userRouter';
import { blogRouter } from './api/blog/blogRouter';
import { verifyAdmin } from './common/middleware/auth';

const router = Router();

router.use('/users', userRouter);
router.use('/blogs', blogRouter);

export default router;
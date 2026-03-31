import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware';

const router = Router();

router.post('/presign', requireAuth, async (req, res) => {
  const filename = req.body.filename ?? 'upload.jpg';
  res.json({
    uploadUrl: `https://s3.example.com/linkup/${filename}?signature=mock`,
    fileUrl: `https://cdn.example.com/linkup/${filename}`
  });
});

export default router;

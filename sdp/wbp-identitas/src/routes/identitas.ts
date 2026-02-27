import { Router, Request, Response, NextFunction } from 'express';
import { identitasService } from '../service/identitas-service';

const router = Router();

/**
 * GET /api/identitas - List all identities
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = parseInt(req.query.limit as string || '10', 10);
    const offset = parseInt(req.query.offset as string || '0', 10);
    
    const result = await identitasService.getAll(limit, offset);
    
    res.json(result);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/identitas/count - Get total count
 */
router.get('/count', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const count = await identitasService.count();
    res.json({ count });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/identitas/search - Search identities
 */
router.get('/search', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = req.query.q as string || '';
    const limit = parseInt(req.query.limit as string || '10', 10);
    
    const data = await identitasService.search(query, limit);
    
    res.json({ data, count: data.length });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/identitas/:nomorInduk - Get identity by ID
 */
router.get('/:nomorInduk', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { nomorInduk } = req.params;
    const data = await identitasService.getById(nomorInduk);
    
    if (!data) {
      res.status(404).json({ error: 'Identitas not found' });
      return;
    }
    
    res.json(data);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/identitas/:nomorInduk/exists - Check if identity exists
 */
router.get('/:nomorInduk/exists', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { nomorInduk } = req.params;
    const exists = await identitasService.exists(nomorInduk);
    res.json({ exists });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/identitas - Create new identity
 */
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body;
    const created = await identitasService.create(data);
    res.status(201).json(created);
  } catch (error) {
    next(error);
  }
});

/**
 * PATCH /api/identitas/:nomorInduk - Update identity
 */
router.patch('/:nomorInduk', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { nomorInduk } = req.params;
    const data = req.body;
    
    const updated = await identitasService.update(nomorInduk, data);
    
    if (!updated) {
      res.status(404).json({ error: 'Identitas not found' });
      return;
    }
    
    res.json(updated);
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/identitas/:nomorInduk - Full update identity
 */
router.put('/:nomorInduk', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { nomorInduk } = req.params;
    const data = req.body;
    
    // For full update, we treat it like PATCH for now
    const updated = await identitasService.update(nomorInduk, data);
    
    if (!updated) {
      res.status(404).json({ error: 'Identitas not found' });
      return;
    }
    
    res.json(updated);
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/identitas/:nomorInduk - Delete identity
 */
router.delete('/:nomorInduk', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { nomorInduk } = req.params;
    const deleted = await identitasService.delete(nomorInduk);
    
    if (!deleted) {
      res.status(404).json({ error: 'Identitas not found' });
      return;
    }
    
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;

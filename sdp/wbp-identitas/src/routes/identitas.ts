import { Router, Request, Response, NextFunction } from 'express';
import { identitasService } from '../service/identitas-service';
import type { RequestContext } from '@sdp/shared/context';

const router = Router();

/**
 * Build RequestContext from HTTP request
 * In a real app, this would come from auth middleware (JWT, session, etc.)
 */
function buildContext(req: Request): RequestContext {
  // Extract from headers (set by upstream like API Gateway)
  // Or from auth middleware
  const userId = req.headers['x-user-id'] as string | undefined;
  const userRoles = (req.headers['x-user-roles'] as string)?.split(',').filter(Boolean) ?? [];
  const permissions = (req.headers['x-user-permissions'] as string)?.split(',').filter(Boolean) ?? [];
  const requestId = (req.headers['x-request-id'] as string) ?? crypto.randomUUID();
  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() 
    ?? req.ip 
    ?? req.socket.remoteAddress 
    ?? undefined;
  const userAgent = req.headers['user-agent'] as string | undefined;

  return {
    userId,
    userRoles,
    permissions,
    requestId,
    startedAt: new Date(),
    ip,
    userAgent,
  };
}

/**
 * GET /api/identitas - List all identities
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ctx = buildContext(req);
    const limit = parseInt(req.query.limit as string || '10', 10);
    const offset = parseInt(req.query.offset as string || '0', 10);
    
    const result = await identitasService.getAll(ctx, limit, offset);
    
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
    const ctx = buildContext(req);
    const count = await identitasService.count(ctx);
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
    const ctx = buildContext(req);
    const query = req.query.q as string || '';
    const limit = parseInt(req.query.limit as string || '10', 10);
    
    const data = await identitasService.search(ctx, query, limit);
    
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
    const ctx = buildContext(req);
    const { nomorInduk } = req.params;
    const data = await identitasService.getById(ctx, nomorInduk);
    
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
    const ctx = buildContext(req);
    const { nomorInduk } = req.params;
    const exists = await identitasService.exists(ctx, nomorInduk);
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
    const ctx = buildContext(req);
    const data = req.body;
    const created = await identitasService.create(ctx, data);
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
    const ctx = buildContext(req);
    const { nomorInduk } = req.params;
    const data = req.body;
    
    const updated = await identitasService.update(ctx, nomorInduk, data);
    
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
    const ctx = buildContext(req);
    const { nomorInduk } = req.params;
    const data = req.body;
    
    // For full update, we treat it like PATCH for now
    const updated = await identitasService.update(ctx, nomorInduk, data);
    
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
    const ctx = buildContext(req);
    const { nomorInduk } = req.params;
    const deleted = await identitasService.delete(ctx, nomorInduk);
    
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

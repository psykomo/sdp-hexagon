import { Router } from 'express';
import { RequestContext } from '@sdp/shared';
import { WbpRegistrasiService } from '../contracts/wbp-registrasi-service';

export function createRegistrasiRouter(service: WbpRegistrasiService) {
  const router = Router();

  // Middleware to extract context (placeholder)
  const withContext = (req: any, res: any, next: any) => {
    req.ctx = {
      requestId: req.headers['x-request-id'] || Math.random().toString(36).substring(7),
      userId: req.headers['x-user-id'] || 'anonymous',
      permissions: req.headers['x-user-permissions'] ? String(req.headers['x-user-permissions']).split(',') : [],
      userRoles: req.headers['x-user-roles'] ? String(req.headers['x-user-roles']).split(',') : [],
      startedAt: new Date(),
      ip: req.headers['x-forwarded-for'] || req.socket?.remoteAddress,
      userAgent: req.headers['user-agent'],
    } as RequestContext;
    next();
  };

  router.use(withContext);

  // GET /api/registrasi - List all registrations
  router.get('/', async (req: any, res) => {
    try {
      const { nomorInduk, limit, offset } = req.query;
      const result = await service.getRegistrasiList(req.ctx, {
        nomorInduk: nomorInduk ? String(nomorInduk) : undefined,
        limit: limit ? parseInt(String(limit), 10) : undefined,
        offset: offset ? parseInt(String(offset), 10) : undefined,
      });
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // GET /api/registrasi/:id - Get a specific registration
  router.get('/:id', async (req: any, res) => {
    try {
      const result = await service.getRegistrasiById(req.ctx, req.params.id);
      if (!result) {
        return res.status(404).json({ error: 'Not found' });
      }
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // POST /api/registrasi - Create a new registration
  router.post('/', async (req: any, res) => {
    try {
      const result = await service.createRegistrasi(req.ctx, req.body);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // PATCH /api/registrasi/:id - Update an existing registration
  router.patch('/:id', async (req: any, res) => {
    try {
      const result = await service.updateRegistrasi(req.ctx, req.params.id, req.body);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // DELETE /api/registrasi/:id - Delete a registration
  router.delete('/:id', async (req: any, res) => {
    try {
      await service.deleteRegistrasi(req.ctx, req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
}

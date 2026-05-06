import { Router } from 'express';
import { db } from '../lib/db';

type WithMongoId = { _id: string; [key: string]: unknown };
function project<T extends WithMongoId>(doc: T): Omit<T, '_id'> & { id: string } {
  const { _id, ...rest } = doc;
  return { id: _id, ...rest } as Omit<T, '_id'> & { id: string };
}

const router = Router();

router.get('/', async (req, res) => {
  const items = await db.collection('records').find();
  res.json(items.map(project));
});

router.post('/', async (req, res) => {
  const body = req.body as { name?: string; category?: string; quantity?: number; status?: string; notes?: string };
  if (!body || !body.name) {
    res.status(400).json({ error: 'name is required' });
    return;
  }
  if (!body.category) {
    res.status(400).json({ error: 'category is required' });
    return;
  }
  const now = new Date().toISOString();
  const doc: Record<string, unknown> = {
    ...body,
    status: body.status ?? 'active',
    createdAt: now,
    updatedAt: now,
  };
  delete (doc as { id?: unknown }).id;
  const id = await db.collection('records').insertOne(doc);
  const created = await db.collection('records').findById(id);
  if (!created) {
    res.status(500).json({ error: 'failed to create' });
    return;
  }
  res.status(201).json(project(created));
});

router.put('/:id', async (req, res) => {
  const body = req.body as { name?: string; category?: string; quantity?: number; status?: string; notes?: string };
  const now = new Date().toISOString();
  const updated_fields: Record<string, unknown> = {
    ...body,
    updatedAt: now,
  };
  delete (updated_fields as { id?: unknown }).id;
  const found = await db.collection('records').findById(req.params.id);
  if (!found) {
    res.status(404).json({ error: 'Not found' });
    return;
  }
  await db.collection('records').updateOne(req.params.id, updated_fields);
  const updated = await db.collection('records').findById(req.params.id);
  if (!updated) {
    res.status(404).json({ error: 'Not found' });
    return;
  }
  res.json(project(updated));
});

router.delete('/:id', async (req, res) => {
  const found = await db.collection('records').findById(req.params.id);
  if (!found) {
    res.status(404).json({ error: 'Not found' });
    return;
  }
  await db.collection('records').deleteOne(req.params.id);
  res.json({ success: true });
});

export default router;
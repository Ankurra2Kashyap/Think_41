import express from 'express';
import { getRecalculationOrder } from '../utils/topoSort.js';
import CellDependency from '../models/CellDependency.js';

const router = express.Router();

router.get('/spreadsheets/:spreadsheetId/topo-sort', async (req, res) => {
  const { spreadsheetId } = req.params;
  const { start } = req.query;

  if (!start) {
    return res.status(400).json({ error: 'Missing required query param: start' });
  }

  try {
    const result = await getRecalculationOrder(spreadsheetId, start, CellDependency);

    if (result.error) {
      return res.status(400).json(result);
    }

    return res.status(200).json({ order: result.order });
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

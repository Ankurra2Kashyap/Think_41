import express from 'express';
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

async function getRecalculationOrder(spreadsheetId, startCellId, CellDependency) {
  const graph = {};
  const visited = {};
  const stack = [];
  const visiting = new Set();
  let cycleDetected = false;
  const cyclePath = [];

  const deps = await CellDependency.find({ spreadsheetId });

  deps.forEach(dep => {
    if (!graph[dep.dependsOn]) graph[dep.dependsOn] = [];
    graph[dep.dependsOn].push(dep.cellId);
  });

  const dfs = (cell) => {
    if (visiting.has(cell)) {
      cycleDetected = true;
      cyclePath.push(cell);
      return;
    }
    if (visited[cell]) return;

    visiting.add(cell);
    const neighbors = graph[cell] || [];
    for (let n of neighbors) dfs(n);
    visiting.delete(cell);
    visited[cell] = true;
    stack.push(cell);
  };

  dfs(startCellId);

  if (cycleDetected) {
    return { error: 'cycle detected involving cells', cells: [...visiting] };
  }

  return { order: stack.reverse() };
}

export default router;

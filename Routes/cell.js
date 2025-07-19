import express from 'express';
import Cell from '../models/Cell.js';
import CellDependency from '../models/CellDependency.js';
import { extractDependencies } from '../utils/formulaParser.js';

const router = express.Router();
 
router.post('/:spreadsheetId/cells/:cellId/value', async (req, res) => {
  const { spreadsheetId, cellId } = req.params;
  const { value } = req.body;

  await Cell.findOneAndUpdate(
    { spreadsheetId, cellId },
    { value, formula: null },
    { upsert: true }
  );

  await CellDependency.deleteMany({ spreadsheetId, cellId });

  res.json({ cell_id: cellId, value, status: 'value set' });
});
 
router.post('/:spreadsheetId/cells/:cellId/formula', async (req, res) => {
  const { spreadsheetId, cellId } = req.params;
  const { formula_string } = req.body;

  const dependencies = extractDependencies(formula_string);

  await Cell.findOneAndUpdate(
    { spreadsheetId, cellId },
    { formula: formula_string, value: null },
    { upsert: true }
  );

  await CellDependency.deleteMany({ spreadsheetId, cellId });

  await Promise.all(
    dependencies.map(dep =>
      CellDependency.create({ spreadsheetId, cellId, dependsOn: dep })
    )
  );

  res.json({
    cell_id: cellId,
    formula_string,
    status: 'formula set',
    dependencies_identified: dependencies,
  });
});
 
router.get('/:spreadsheetId/cells/:cellId', async (req, res) => {
  const { spreadsheetId, cellId } = req.params;

  const cell = await Cell.findOne({ spreadsheetId, cellId });

  if (!cell) return res.status(404).json({ error: 'Cell not found' });

  res.json({
    cell_id: cellId,
    value: cell.value,
    formula_string: cell.formula || null,
  });
});
 
router.get('/:spreadsheetId/cells/:cellId/dependents', async (req, res) => {
  const { spreadsheetId, cellId } = req.params;

  const deps = await CellDependency.find({ spreadsheetId, dependsOn: cellId });

  res.json(deps.map(d => d.cellId));
});

 
router.get('/:spreadsheetId/cells/:cellId/precedents', async (req, res) => {
  const { spreadsheetId, cellId } = req.params;

  const precedents = await CellDependency.find({ spreadsheetId, cellId });

  res.json(precedents.map(p => p.dependsOn));
});

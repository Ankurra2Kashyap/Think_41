import express from 'express';
import mongoose from 'mongoose';
import cellRoutes from './routes/cells.js';

const app = express();
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/spreadsheet', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use('/spreadsheets', cellRoutes);

app.listen(3000, () => {
  console.log('Server running on port 3000');
});

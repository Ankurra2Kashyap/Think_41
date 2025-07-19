import mongoose from 'mongoose';
const spreadsheetSchema = new mongoose.Schema({
    name:String
})

export default mongoose.model('Spreadsheet',spreadsheetSchema);


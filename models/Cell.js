import mongoose from "mongoose";
import Spreadsheet from "./Spreadsheet";
// import Spreadsheet from "./Spreadsheet";

const cellSchema = new mongoose.Schema({
    SpreadsheetId: {type: mongoose.Schema.Types.ObjectId,ref:'Spreadsheet'},
    cellId: String,
    value:String,
    formula:String
})

cellSchema.index({Spreadsheet:1, cellId:1},{unique: true});

export default mongoose.model('Cell', cellSchema);
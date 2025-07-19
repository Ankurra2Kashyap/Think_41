import mongoose from "mongoose";
// import Spreadsheet from "./Spreadsheet";

const cellDependencySchema = new mongoose.Schema({
    SpreadsheetId: {type:mongoose.Schema.Types.ObjectId,ref:'Spreadsheet'},
    cellId: String,
    dependsOn:String,
})

export default mongoose.model('CellDependency',cellDependencySchema);
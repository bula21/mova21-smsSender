import { Schema, model, models } from 'mongoose';

const LogEntrySchema = new Schema({
  _id: Schema.Types.ObjectId,
  email: String,
  phonenumbers: String,
  message: String,
}, {
  collection: 'log',
  timestamps: true
})

const LogEntry = models.LogEntry || model('LogEntry', LogEntrySchema);

export default LogEntry;

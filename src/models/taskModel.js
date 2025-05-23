import mongoose, { Schema } from 'mongoose';

const taskSchema = new Schema(
    {   taskfor: { type: String, required: true },
        title: { type: String, required: true },
        description: { type: String },
        dueDate: { type: Date },
        priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Low' },
        status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending' },
        assignedBy: { type: String, required: true },
    },
    {
        timestamps: true,
        collection: 'tasks'  // Specify the collection name
    }
);

export default mongoose.models.Task || mongoose.model('Task', taskSchema);

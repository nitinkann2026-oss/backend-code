import mongoose from "mongoose";

const todoSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },

        status: {
            type: String,
            enum: ["pending", "done"],
            default: "pending",
        },
    },
    { timestamps: true }
);

const Todo = mongoose.model("Todo", todoSchema);

export default Todo;
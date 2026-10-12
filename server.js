import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import dns from "node:dns";
import Todo from "./model/todo.js";

dotenv.config();

// Ensure SRV records for MongoDB Atlas resolve reliably on Windows
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const app = express();

app.use(cors());
app.use(express.json());

// Server check
app.get("/", (req, res) => {
    res.send("Todo API is running");
});

// 1. GET - Sabhi todos
app.get("/todos", async (req, res) => {
    try {
        const todos = await Todo.find();
        res.json({ success: true, data: todos });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
// WritableStreamDefaultWriter
// 2. POST - Naya todo
app.post("/todos", async (req, res) => {
    try {
        const { title } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({
                success: false,
                message: "Title is required",
            });
        }

        const newTodo = await Todo.create({ title: title.trim() });

        res.status(201).json({ success: true, data: newTodo });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// 3. PUT - Todo update
app.put("/todos/:id", async (req, res) => {
    try {
        const { title, status } = req.body;

        const updatedTodo = await Todo.findByIdAndUpdate(
            req.params.id,
            { title, status },
            { new: true, runValidators: true }
        );

        if (!updatedTodo) {
            return res.status(404).json({
                success: false,
                message: "Todo not found",
            });
        }

        res.json({ success: true, data: updatedTodo });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// 4. DELETE - Todo delete
app.delete("/todos/:id", async (req, res) => {
    try {
        const deletedTodo = await Todo.findByIdAndDelete(req.params.id);

        if (!deletedTodo) {
            return res.status(404).json({
                success: false,
                message: "Todo not found",
            });
        }

        res.json({ success: true, message: "Todo deleted successfully" });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// MongoDB connect karke server start karo
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully");

        app.listen(process.env.PORT || 5000, () => {
            console.log("Server running on http://localhost:5000");
        });
    })
    .catch((error) => {
        console.error("MongoDB connection failed:", error.message);
    });


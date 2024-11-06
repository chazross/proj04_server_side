import express from 'express';

const router = express.Router();

// Connecting to the database this may be SQLLite
const connection = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "root",
    database: "book_facts"
});

// GET all questions
router.get("/", async (req, res) => {   
    try {
        const [data] = await connection.promise().query(`SELECT * FROM questions;`);
        res.status(200).json({ questions: data });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST a new question
router.post("/", async (req, res) => {
    try {
        const { question_text, answer, category_id } = req.body;
        await connection.promise().query(
            `INSERT INTO questions (question_text, answer, category_id) VALUES (?, ?, ?)`,
            [question_text, answer, category_id]
        );
        res.status(201).json({ message: 'Question successfully added' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET questions by category ID
router.get("/by-category", async (req, res) => {
    try {
        const { categoryId } = req.query;
        const [data] = await connection.promise().query(
            `SELECT * FROM questions WHERE category_id = ?;`, [categoryId]
        );
        res.status(200).json({ questions: data });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETE a question by ID
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await connection.promise().query(
            `DELETE FROM questions WHERE question_id = ?;`, [id]
        );
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Question successfully deleted' });
        } else {
            res.status(404).json({ message: 'Question not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// UPDATE (PUT) a question by ID
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { question_text, answer, category_id } = req.body;
        const [result] = await connection.promise().query(
            `UPDATE questions SET question_text=?, answer=?, category_id=? WHERE question_id=?;`,
            [question_text, answer, category_id, id]
        );
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Question successfully updated' });
        } else {
            res.status(404).json({ message: 'Question not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PATCH a question by ID
router.patch("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { question_text, answer, category_id } = req.body;

        if (question_text) {
            await connection.promise().query(
                `UPDATE questions SET question_text=? WHERE question_id=?;`,
                [question_text, id]
            );
        } 
        if (answer) {
            await connection.promise().query(
                `UPDATE questions SET answer=? WHERE question_id=?;`,
                [answer, id]
            );
        }
        if (category_id) {
            await connection.promise().query(
                `UPDATE questions SET category_id=? WHERE question_id=?;`,
                [category_id, id]
            );
        }
        res.status(200).json({ message: 'Question successfully updated' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
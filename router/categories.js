import express from 'express';

const router = express.Router();

// Connecting to the database this may be SQLlite
const connection = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "root",
    database: "book_facts"
});

// GET all categories
router.get("/", async (req, res) => {   
    try {
        const [data] = await connection.promise().query(`SELECT * FROM categories;`);
        res.status(200).json({ categories: data });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST a new category
router.post("/", async (req, res) => {
    try {
        const { category_name } = req.body;
        await connection.promise().query(
            `INSERT INTO categories (category_name) VALUES (?);`,
            [category_name]
        );
        res.status(201).json({ message: 'Category successfully added ' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETE a category by ID
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await connection.promise().query(
            `DELETE FROM categories WHERE category_id = ?;`, [id]
        );
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Category successfully deleted' });
        } else {
            res.status(404).json({ message: 'Category not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;


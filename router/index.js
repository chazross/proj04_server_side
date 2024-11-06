import express from 'express';
import cors from 'cors'; 
import questions from './routers/questions.js';
import categories from './routers/categories.js'; 

const app = express();
app.use(express.json());
app.use(cors());  
app.use('/questions', questions);
app.use('/categories', categories); 

// Connecting to the database
const connection = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "root",
    database: "book_facts"
});

// Home route
app.get('/', (req, res) => {
    res.send('Proj04-Victorian Books');
});


// Start the server
app.listen(3003, () => {
    console.log('Listening on port 3003');
});


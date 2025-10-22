const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

// Middleware
app.use(cors()); // Enable CORS for all origins (for development)
app.use(express.json()); // Parse JSON bodies

// --- In-memory "database" ---
let items = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' }
];
let nextId = 3;

// --- API ROUTES ---

// READ (GET all items)
app.get('/api/items', (req, res) => {
    res.json(items);
});

// CREATE (POST a new item)
app.post('/api/items', (req, res) => {
    const newItem = {
        id: nextId++,
        name: req.body.name
    };
    items.push(newItem);
    res.status(201).json(newItem); // 201 = Created
});

// UPDATE (PUT an existing item)
app.put('/api/items/:id', (req, res) => {
    const idToUpdate = parseInt(req.params.id);
    const newName = req.body.name;

    const item = items.find(i => i.id === idToUpdate);

    if (item) {
        item.name = newName;
        res.json(item);
    } else {
        res.status(404).send('Item not found');
    }
});

// DELETE (DELETE an item)
app.delete('/api/items/:id', (req, res) => {
    const idToDelete = parseInt(req.params.id);
    items = items.filter(i => i.id !== idToDelete);
    res.status(204).send(); // 204 = No Content
});

// --- START SERVER ---
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
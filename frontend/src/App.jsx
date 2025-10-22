import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/items';

function App() {
  const [items, setItems] = useState([]);
  const [newItemName, setNewItemName] = useState('');
  const [itemToUpdate, setItemToUpdate] = useState(null);
  const [updatedName, setUpdatedName] = useState('');

  // 1. READ (GET)
  const fetchItems = async () => {
    try {
      const response = await axios.get(API_URL);
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // 2. CREATE (POST)
  const handleCreate = async (e) => {
    e.preventDefault(); 
    if (!newItemName) return;
    try {
      const response = await axios.post(API_URL, { name: newItemName });
      setItems([...items, response.data]); 
      setNewItemName('');
    } catch (error) {
      console.error('Error creating item:', error);
    }
  };

  // 3. UPDATE (PUT)
  const handleUpdate = async (id) => {
    if (!updatedName) return;
    try {
      const response = await axios.put(`${API_URL}/${id}`, { name: updatedName });

      setItems(items.map(item => (item.id === id ? response.data : item)));
      setItemToUpdate(null);
      setUpdatedName('');
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };
  
  // 4. DELETE
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);

      setItems(items.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  return (

    <div className="min-h-screen bg-gray-100 flex items-center ml-100 p-4 justify-center">
  
      <div className="w-full max-w-xl p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">CRUD App</h1>
      
      {/* --- Create Form --- */}
      <form onSubmit={handleCreate} className="flex gap-2 mb-4">
        <input 
          type="text" 
          placeholder="New item name"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)} 
          className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button 
          type="submit"
          className="bg-blue-500 text-black px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Add Item
        </button>
      </form>

      {/* --- Read (List Items) --- */}
      <ul className="space-y-3">
        {items.map(item => (
          <li 
            key={item.id} 
            className="p-3 bg-white rounded-md shadow-sm flex items-center justify-between"
          >
            {itemToUpdate === item.id ? (
              // --- Update Form (inline) ---
              <div className="flex-grow flex gap-2">
                <input 
                  type="text"
                  placeholder="New name"
                  value={updatedName}
                  onChange={(e) => setUpdatedName(e.target.value)}
                  className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button 
                  onClick={() => handleUpdate(item.id)}
                  className="bg-green-500 text-black px-3 py-1 rounded-md hover:bg-green-600 transition-colors"
                >
                  Save
                </button>
                <button 
                  onClick={() => setItemToUpdate(null)}
                  className="bg-gray-400 text-black px-3 py-1 rounded-md hover:bg-gray-500 transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              // --- Display Item ---
              <>
                <span className="text-lg text-gray-700">{item.name}</span>
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      setItemToUpdate(item.id);
                      setUpdatedName(item.name);
                    }}
                    className="bg-yellow-500 text-black px-3 py-1 rounded-md hover:bg-yellow-600 transition-colors"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-500 text-black px-3 py-1 rounded-md hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
    </div>
  );
}

export default App;
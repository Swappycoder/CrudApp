import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const App = () => {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [error, setError] = useState(null);
  const [selectedItemId, setSelectedItemId] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch('http://10.0.2.2:3000/items'); // Update this URL based on your environment
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error('Fetch items error:', error);
      setError('Failed to fetch items');
    }
  };

  const addItem = async () => {
    try {
      const response = await fetch('http://10.0.2.2:3000/items', { // Update this URL based on your environment
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const newItem = await response.json();
      setItems([...items, newItem]);
      setName('');
    } catch (error) {
      console.error('Add item error:', error);
      setError('Failed to add item');
    }
  };

  const updateItem = async (id) => {
    try {
      const response = await fetch(`http://10.0.2.2:3000/items/${id}`, { // Update this URL based on your environment
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const updatedItem = await response.json();
      console.log('Updated Item:', updatedItem); // Add this line for logging
      setItems(items.map(item => (item._id === id ? updatedItem : item)));
      setName('');
      setSelectedItemId(null);
    } catch (error) {
      console.error('Update item error:', error);
      setError('Failed to update item');
    }
  };

  const deleteItem = async (id) => {
    try {
      const response = await fetch(`http://10.0.2.2:3000/items/${id}`, { // Update this URL based on your environment
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      setItems(items.filter(item => item._id !== id));
    } catch (error) {
      console.error('Delete item error:', error);
      setError('Failed to delete item');
    }
  };

  const handleUpdate = (item) => {
    setName(item.name);
    setSelectedItemId(item._id);
  };

  return (
    <SafeAreaProvider>
      <PaperProvider>
        <View style={styles.container}>
          <Text style={styles.title}>CRUD App</Text>
          {error && <Text style={styles.error}>{error}</Text>}
          <TextInput
            style={styles.input}
            placeholder="Item Name"
            value={name}
            onChangeText={setName}
          />
          <Button title={selectedItemId ? "Update Item" : "Add Item"} onPress={() => selectedItemId ? updateItem(selectedItemId) : addItem()} />
          <FlatList
            data={items}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <Text>{item.name}</Text>
                <Button title="Edit" onPress={() => handleUpdate(item)} />
                <Button title="Delete" onPress={() => deleteItem(item._id)} />
              </View>
            )}
          />
        </View>
      </PaperProvider>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
});

export default App;

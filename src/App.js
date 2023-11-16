import logo from "./logo.svg";
import "./App.css";
import { useState } from "react";

const initialItems = [
  { id: 1, description: "Passports", quantity: 2, packed: false },
  { id: 2, description: "Socks", quantity: 12, packed: false },
  { id: 3, description: "Charger", quantity: 3, packed: true },
];

function App() {
  const [items, setItems] = useState([]);

  // this function will manage addition of new items to alreadt existing items list
  function handleAddItems(item) {
    setItems((items) => [...items, item]);
    // we are using this to add the current item to overall items array
  }

  // to manage delete items and maintain the items array state
  function handleDeleteItems(id) {
    console.log(id);
    setItems((items) => items.filter((item) => item.id !== id));
  }

  function handleToggleItems(id) {
    setItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, packed: !item.packed } : item
      )
    );
  }

  return (
    <div className="App">
      <Logo />
      <Form onAddItems={handleAddItems} />
      <PackingList
        items={items}
        setItems={setItems}
        onDeleteItem={handleDeleteItems}
        onToggleItem={handleToggleItems}
      />
      <Stats items={items} />
    </div>
  );
}
export default App;

function Logo() {
  return <h1> Far Away</h1>;
}

function Form({ onAddItems }) {
  // states
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(1);

  function handleSubmit(e) {
    e.preventDefault();

    if (!description) {
      alert("Enter Items to pack");
      return;
    }

    console.log(description, quantity);
    const newItem = { description, quantity, packed: false, id: Date.now() };
    console.log(newItem);

    onAddItems(newItem);

    setDescription("");
    setQuantity(1);
  }

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <h3>What you pack for your trip ?</h3>
      <select value={quantity} onChange={(e) => setQuantity(e.target.value)}>
        {Array.from({ length: 5 }, (_, i) => i + 1).map((num) => {
          return (
            <option value={num} key={num}>
              {num}
            </option>
          );
        })}
      </select>
      <input
        type="text"
        placeholder="add item"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button onClick={handleSubmit}>Add</button>
    </form>
  );
}

function PackingList({ items, onDeleteItem, onToggleItem, setItems }) {
  const [sortby, setSortBy] = useState("input");

  let sortedItems;

  if (sortby === "input") sortedItems = items;

  if (sortby === "description")
    sortedItems = items
      .slice()
      .sort((a, b) => a.description.localeCompare(b.description));

  if (sortby === "packed")
    sortedItems = items
      .slice()
      .sort((a, b) => Number(a.packed) - Number(b.packed));

  function handleClearItems() {
    console.log("clicked on clear items button  ");
    setItems((sortedItems = []));
  }

  return (
    <div className="list">
      <ul>
        {sortedItems.map((item) => (
          <Item
            id={item.id}
            description={item.description}
            quantity={item.quantity}
            packed={item.packed}
            onDeleteItem={onDeleteItem}
            onToggleItem={onToggleItem}
          />
        ))}
      </ul>
      {/*  adding sorting component */}

      <div className="actions">
        <select value={sortby} onChange={(e) => setSortBy(e.target.value)}>
          <option value="input">Sort by input order </option>
          <option value="description">Sort by description </option>
          <option value="packed">Sort by packed status </option>
        </select>

        <button onClick={() => handleClearItems()}> Clear List</button>
      </div>
    </div>
  );
}

function Item(props) {
  return (
    <li className="item">
      <input
        type="checkbox"
        value={props.packed}
        onChange={() => props.onToggleItem(props.id)}
      />
      <span style={props.packed ? { textDecoration: "line-through" } : {}}>
        {props.quantity} {props.description}
      </span>
      <button onClick={() => props.onDeleteItem(props.id)}>❌</button>
    </li>
  );
}

function Stats({ items }) {
  const numItems = items.length;
  const packedItems = items.filter((item) => item.packed === true).length;
  const packedPercent = Math.round((packedItems / numItems) * 100);

  return (
    <footer className="stats">
      {packedItems === 0
        ? `Get ready to 💼 pack your items for the trip 🧳`
        : packedPercent === 100
        ? `Packing Completed, Lets Goo ✈️`
        : `You have ${numItems} items in the list and You Packed ${packedItems} (${packedPercent} %)`}
    </footer>
  );
}

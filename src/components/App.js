import FoodList from "./FoodList";
import items from "../mock.json";
import { useState } from "react";

function App() {
  const [order, setOrder] = useState("createdAt");
  const sortedItems = items.sort((a, b) => b[order] - a[order]);

  const handleNewestClick = () => setOrder("createdAt");
  const handleKCalClick = () => setOrder("calorie");

  return (
    <div>
      <button onClick={handleNewestClick}>최신순</button>
      <button onClick={handleKCalClick}>칼로리순</button>
      <FoodList items={sortedItems} />
    </div>
  );
}

export default App;

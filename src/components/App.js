import FoodList from "./FoodList";
import { useEffect, useState } from "react";
import { createFood, deleteFood, getFoods, updateFood } from "../api";
import Foodform from "./Foodform";
import LocaleSelect from "./LocaleSelect";
import backgroundImg from "../assets/background.png";
import logoImg from "../assets/logo.png";
import searchImg from "../assets/ic-search.png";
import useTranslate from "../hooks/useTranslate";
import logoTextImg from "../assets/logo-text.png";
import "./App.css";

function AppSortButton({ selected, children, onClick }) {
  return (
    <button
      disabled={selected}
      className={`AppSortButton ${selected ? "selected" : ""}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function App() {
  const [items, setItems] = useState([]);
  const [order, setOrder] = useState("createdAt");
  const [cursor, setCursor] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingError, setLoadingError] = useState(null);
  const [search, setSearch] = useState("");

  const t = useTranslate();

  const sortedItems = items.sort((a, b) => b[order] - a[order]);

  const handleNewestClick = () => setOrder("createdAt");
  const handleKCalClick = () => setOrder("calorie");

  const handleDelete = async (id) => {
    const result = await deleteFood(id);
    if (!result) return;

    const nextItems = items.filter((item) => item.id !== id);
    setItems(nextItems);
  };

  const handleLoad = async (options) => {
    let result;
    try {
      setIsLoading(true);
      setLoadingError(null);
      result = await getFoods(options);
    } catch (error) {
      setLoadingError(error);
      return;
    } finally {
      setIsLoading(false);
    }
    const {
      foods,
      paging: { nextCursor },
    } = result;
    if (!options.cursor) {
      setItems(foods);
    } else {
      setItems((prevItems) => [...prevItems, ...foods]);
    }
    setCursor(nextCursor);
  };

  const handleLoadMore = () => {
    handleLoad({
      order,
      cursor,
      search,
    });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearch(e.target["search"].value);
  };

  const handleCreateSuccess = (review) => {
    setItems((prevItems) => [review, ...prevItems]);
  };

  const handleUpdateSuccess = (food) => {
    setItems((prevItems) => {
      const splitIdx = prevItems.findIndex((item) => item.id === food.id);
      return [
        ...prevItems.slice(0, splitIdx),
        food,
        ...prevItems.slice(splitIdx + 1),
      ];
    });
  };

  useEffect(() => {
    handleLoad({
      order,
      search,
    });
  }, [order, search]);

  return (
    <div className="App" style={{ backgroundImage: `url("${backgroundImg}")` }}>
      <div className="App-nav">
        <img src={logoImg} alt="Foodit" />
      </div>
      <div className="App-container">
        <div className="App-FoodForm">
          <Foodform
            onSubmit={createFood}
            onSubmitSuccess={handleCreateSuccess}
          />
        </div>
        <div className="App-filter">
          <form className="App-search" onSubmit={handleSearchSubmit}>
            <input className="App-search-input" name="search" />
            <button className="App-search-button" type="submit">
              <img src={searchImg} alt="검색" />{" "}
            </button>
          </form>
          <div className="App-orders">
            <AppSortButton
              selected={order === "createdAt"}
              onClick={handleNewestClick}
            >
              {t("newest")}
            </AppSortButton>
            <AppSortButton
              selected={order === "calorie"}
              onClick={handleKCalClick}
            >
              {t("sort by calorie")}
            </AppSortButton>
          </div>
        </div>
        <FoodList
          className="App-FoodList"
          items={sortedItems}
          onDelete={handleDelete}
          onUpdate={updateFood}
          onUpdateSuccess={handleUpdateSuccess}
        />
        {cursor && (
          <button
            className="App-load-more-button"
            disabled={isLoading}
            onClick={handleLoadMore}
          >
            {t("load more")}
          </button>
        )}
        {loadingError?.message && <span>{loadingError.message}</span>}
      </div>
      <div className="App-footer">
        <div className="App-footer-container">
          <img src={logoTextImg} alt="Foodit" />
          <LocaleSelect />
          <div className="App-footer-menu">
            {t("terms of service")} | {t(`privacy policy`)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

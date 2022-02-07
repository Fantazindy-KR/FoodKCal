import { useState } from "react";
import useTranslate from "../hooks/useTranslate";
import Foodform from "./Foodform";
import "./FoodList.css";

function formatDate(value) {
  const date = new Date(value);
  return `${date.getFullYear()}. ${date.getMonth() + 1}. ${date.getDate()}`;
}

function FoodListItem({ item, onDelete, onEdit }) {
  const t = useTranslate();

  const handleDeleteClick = () => onDelete(item.id);

  const { imgUrl, title, calorie, content, createdAt } = item;

  const handleEditClick = () => {
    onEdit(item.id);
  };

  return (
    <div className="FoodListItem">
      <img src={imgUrl} alt={title} />
      <div>{title}</div>
      <div>{calorie}</div>
      <div>{content}</div>
      <div>{formatDate(createdAt)}</div>
      <button onClick={handleDeleteClick}>{t("delete button")}</button>
      <button onClick={handleEditClick}>{t("edit button")}</button>
    </div>
  );
}

function FoodList({ items, onDelete, onUpdate, onUpdateSuccess }) {
  const [editingId, setEditingId] = useState(null);

  const handleCancel = () => setEditingId(null);

  return (
    <ul className="FoodList">
      {items.map((item) => {
        if (item.id === editingId) {
          const { id, imgUrl, title, calorie, content } = item;
          const initialValues = { title, calorie, content };

          const handleSubmit = (formData) => onUpdate(id, formData);
          const handleSubmitSuccess = (food) => {
            onUpdateSuccess(food);
            setEditingId(null);
          };

          return (
            <li key={item.id}>
              <Foodform
                item={item}
                onDelete={onDelete}
                initialValues={initialValues}
                initialPreview={imgUrl}
                onCancel={handleCancel}
                onSubmit={handleSubmit}
                onSubmitSuccess={handleSubmitSuccess}
              />
            </li>
          );
        }
        return (
          <li key={item.id}>
            <FoodListItem
              item={item}
              onDelete={onDelete}
              onEdit={setEditingId}
            />
          </li>
        );
      })}
    </ul>
  );
}

export default FoodList;

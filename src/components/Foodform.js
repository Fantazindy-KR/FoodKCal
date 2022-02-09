import { useState } from "react";
import useTranslate from "../hooks/useTranslate";
import FileInput from "./FileInput";
import "./Foodform.css";

function sanitize(type, value) {
  switch (type) {
    case "number":
      return Number(value) || 0;

    default:
      return value;
  }
}

const INITIAL_VALUES = {
  title: "",
  calorie: 0,
  content: "",
  imgFile: null,
};

function Foodform({
  initialValues = INITIAL_VALUES,
  initialPreview,
  onSubmit,
  onSubmitSuccess,
  onCancel,
}) {
  const [values, setValues] = useState(initialValues);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittingError, setSubmittingError] = useState(null);

  const t = useTranslate();

  const handleChange = (name, value, type) => {
    setValues((prevValues) => ({
      ...prevValues,
      [name]: sanitize(type, value),
    }));
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    handleChange(name, value, type);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("calorie", values.calorie);
    formData.append("content", values.content);
    formData.append("imgFile", values.imgFile);

    let result;
    try {
      setSubmittingError(null);
      setIsSubmitting(true);
      result = await onSubmit(formData);
    } catch (error) {
      setSubmittingError(error);
      return;
    } finally {
      setIsSubmitting(false);
    }
    //food여야만 하는 이유는 api라는 서버에서 food라는 프로퍼티 이름으로 사용하고 있기 때문
    const { food } = result;
    setValues(INITIAL_VALUES);
    onSubmitSuccess(food);
  };

  return (
    <form className="FoodForm" onSubmit={handleSubmit}>
      <FileInput
        className="FoodForm-preview"
        name="imgFile"
        value={values.imgFile}
        onChange={handleChange}
        initialPreview={initialPreview}
      />
      <div className="FoodForm-rows">
        <div className="FoodForm-title-calorie">
          <input
            className="FoodForm-title"
            name="title"
            value={values.title}
            placeholder={t("title placeholder")}
            onChange={handleInputChange}
          />
          <input
            className="FoodForm-calorie"
            name="calorie"
            type="number"
            value={values.calorie}
            placeholder={t("calorie placeholder")}
            onChange={handleInputChange}
          />
          {onCancel && (
            <button
              className="FoodForm-cancel-button"
              type="button"
              onClick={onCancel}
            >
              {t("cancel button")}
            </button>
          )}
          <button
            className="FoodForm-submit-button"
            type="submit"
            disabled={isSubmitting}
          >
            {t("confirm button")}
          </button>
        </div>
        {submittingError?.message && <div>{submittingError.message}</div>}
        <input
          className="FoodForm-content"
          name="content"
          value={values.content}
          placeholder={t("content placeholder")}
          onChange={handleInputChange}
        />
      </div>
    </form>
  );
}

export default Foodform;

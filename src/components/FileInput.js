import { useEffect, useRef, useState } from "react";
import "./FileInput.css";
import resetWhiteImg from "../assets/ic-reset-white.png";
import placeholderImg from "../assets/preview-placeholder.png";

function FileInput({ className = "", name, value, initialPreview, onChange }) {
  const inputRef = useRef();
  const [preview, setPreview] = useState(initialPreview);

  const handleClearClick = () => {
    const inputNode = inputRef.current;
    if (!inputNode) return;

    inputNode.value = "";
    onChange(name, null);
  };

  const handleChange = (e) => {
    const nextValue = e.target.files[0];
    onChange(name, nextValue);
  };

  useEffect(() => {
    if (!value) return;

    const nextPreview = URL.createObjectURL(value);
    setPreview(nextPreview);

    return () => {
      setPreview(initialPreview);
      URL.revokeObjectURL(nextPreview);
    };
  }, [value, initialPreview]);

  return (
    <div className={`FileInput ${className}`}>
      <img
        className={`FileInput-preview ${preview ? "selected" : ""}`}
        src={preview || placeholderImg}
        alt="이미지 미리보기"
      />
      <input
        className="FileInput-hidden-overlay"
        type="file"
        onChange={handleChange}
        ref={inputRef}
      />
      {value && (
        <button className="FileInput-clear-button" onClick={handleClearClick}>
          <img src={resetWhiteImg} alt="지우기" />
        </button>
      )}
    </div>
  );
}

export default FileInput;

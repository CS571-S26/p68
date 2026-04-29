import { useRef, useState } from "react";

export default function DropZone({ onImage }) {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [dragging, setDragging] = useState(false);

  function handleFile(file) {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      setPreview(dataUrl);
      // Pass both the data URL and the raw file
      onImage(dataUrl, file);
    };
    reader.readAsDataURL(file);
  }

  function handleChange(e) {
    handleFile(e.target.files[0]);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  }

  function handleDragOver(e) {
    e.preventDefault();
    setDragging(true);
  }

  function handleDragLeave() {
    setDragging(false);
  }

  function handleClick() {
    inputRef.current.click();
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  }

  return (
    <div
      className={`dropzone ${dragging ? "active" : ""}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      role="button"
      tabIndex={0}
      aria-label="Upload fabric image. Click or drag and drop a file here."
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        style={{ display: "none" }}
        aria-hidden="true"
        tabIndex={-1}
        id="fabric-image-input"
      />

      {preview ? (
        <>
          <img
            src={preview}
            alt="Uploaded fabric preview"
            className="dropzone-preview"
          />
          <div className="dropzone-overlay" aria-hidden="true">
            <span className="dropzone-overlay-text">Click to replace</span>
          </div>
        </>
      ) : (
        <div className="dropzone-inner">
          <div className="dropzone-icon" aria-hidden="true">↑</div>
          <p className="dropzone-title">Drop fabric image here</p>
          <p className="dropzone-sub">PNG, JPG up to 20 MB</p>
        </div>
      )}
    </div>
  );
}

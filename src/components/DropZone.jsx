import { useRef, useState } from "react";

export default function DropZone({ onImage }) {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [converting, setConverting] = useState(false);

  async function handleFile(file) {
    if (!file) return;

    let processedFile = file;

    // 自动转换 HEIC/HEIF 格式
    const isHeic =
      file.type === "image/heic" ||
      file.type === "image/heif" ||
      file.name.toLowerCase().endsWith(".heic") ||
      file.name.toLowerCase().endsWith(".heif");

    if (isHeic) {
      setConverting(true);
      try {
        const heic2any = (await import("heic2any")).default;
        const blob = await heic2any({
          blob: file,
          toType: "image/jpeg",
          quality: 0.85,
        });
        processedFile = new File(
          [blob],
          file.name.replace(/\.(heic|heif)$/i, ".jpg"),
          { type: "image/jpeg" }
        );
      } catch (err) {
        console.error("HEIC conversion failed:", err);
        alert("Could not convert this image. Please use a JPG or PNG.");
        setConverting(false);
        return;
      }
      setConverting(false);
    }

    if (!processedFile.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      setPreview(dataUrl);
      onImage(dataUrl, processedFile);
    };
    reader.readAsDataURL(processedFile);
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

      {converting ? (
        <div className="dropzone-inner">
          <div className="spinner-ring" role="status" aria-label="Converting image…" />
          <p className="dropzone-title">Converting image…</p>
        </div>
      ) : preview ? (
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
          <p className="dropzone-sub">PNG, JPG, HEIC up to 20 MB</p>
        </div>
      )}
    </div>
  );
}
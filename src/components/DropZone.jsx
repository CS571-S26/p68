import { useRef, useState } from "react";

export default function DropZone({ onImage }) {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [converting, setConverting] = useState(false);

  async function compressImage(file, maxMB) {
    return new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        const canvas = document.createElement("canvas");
        let { width, height } = img;
        const maxPx = 1920;
        if (width > maxPx || height > maxPx) {
          const ratio = Math.min(maxPx / width, maxPx / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d").drawImage(img, 0, 0, width, height);
        let quality = 0.85;
        let dataUrl = canvas.toDataURL("image/jpeg", quality);
        while (dataUrl.length > maxMB * 1024 * 1024 * 1.37 && quality > 0.3) {
          quality -= 0.1;
          dataUrl = canvas.toDataURL("image/jpeg", quality);
        }
        resolve(dataUrl);
      };
      img.src = url;
    });
  }

  async function handleFile(file) {
    if (!file) return;

    let processedFile = file;

    const isHeic =
      file.type === "image/heic" ||
      file.type === "image/heif" ||
      file.name.toLowerCase().endsWith(".heic") ||
      file.name.toLowerCase().endsWith(".heif");

    if (isHeic) {
      setConverting(true);
      try {
        const heic2any = (await import("heic2any")).default;
        const blob = await heic2any({ blob: file, toType: "image/jpeg", quality: 0.85 });
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

    setConverting(true);
    const dataUrl = await compressImage(processedFile, 4);
    setConverting(false);
    setPreview(dataUrl);
    onImage(dataUrl, processedFile);
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
          <div className="spinner-ring" role="status" aria-label="Processing image…" />
          <p className="dropzone-title">Processing image…</p>
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
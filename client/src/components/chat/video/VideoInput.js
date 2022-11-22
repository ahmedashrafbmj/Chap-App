import React from "react";
import PlaySquareOutlined from "@ant-design/icons/PlaySquareOutlined";

export default function VideoInput({ sendVideo }) {
  const inputRef = React.useRef();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const url = URL.createObjectURL(file);
    sendVideo(url);
  };

  return (
    <div className="wrapper" style={{ marginTop: "10px" }}>
      <label htmlFor="video">
        <PlaySquareOutlined
          style={{ fontSize: "29px", color: "#08c", cursor: "pointer" }}
          theme="outlined"
        />
      </label>
      <input
        id="video"
        ref={inputRef}
        className="VideoInput_input"
        type="file"
        onChange={handleFileChange}
        accept=".mov,.mp4"
        style={{ display: "none", visibility: "none" }}
      />
    </div>
  );
}

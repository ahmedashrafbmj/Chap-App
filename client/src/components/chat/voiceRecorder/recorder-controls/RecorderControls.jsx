import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMicrophone,
  faTimes,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
import { formatMinutes, formatSeconds } from "../utils/format-time";
import "./styles.css";
import React from "react";
import { Popover } from "antd";
import { useState } from "react";

export default function RecorderControls({
  recorderState,
  handlers,
  setAudioData,
}) {
  const { recordingMinutes, recordingSeconds, initRecording } = recorderState;
  const { startRecording, saveRecording, cancelRecording } = handlers;
  const [openPopover, setOpenPopover] = useState(false);
  const content = (
    <div className="controls-container">
      {initRecording && (
        <div className="cancel-button-container">
          <button
            className="cancel-button"
            title="Cancel recording"
            onClick={() => {
              cancelRecording();
              hide();
            }}
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
      )}
      <div className="recorder-display">
        <div className="recording-time">
          {initRecording && <div className="recording-indicator"></div>}
          <span>{formatMinutes(recordingMinutes)}</span>
          <span>:</span>
          <span>{formatSeconds(recordingSeconds)}</span>
        </div>
      </div>
      <div className="start-button-container">
        {initRecording ? (
          <button
            className="start-button"
            title="Save recording"
            disabled={recordingSeconds === 0}
            onClick={() => {
              saveRecording();
            }}
          >
            <FontAwesomeIcon icon={faSave} size="2x" />
          </button>
        ) : // <button
        //   className="start-button"
        //   title="Start recording"
        //   onClick={startRecording}
        // >
        //   <FontAwesomeIcon icon={faMicrophone} size="2x" />
        // </button>
        null}
      </div>
    </div>
  );

  // for popover
  const hide = () => {
    setOpenPopover(false);
  };
  const handleOpenChange = (newOpen) => {
    setOpenPopover(newOpen);
  };

  return (
    <Popover
      placement="left"
      content={content}
      trigger="click"
      open={openPopover}
      onOpenChange={handleOpenChange}
    >
      <button
        className="start-button"
        title="Start recording"
        onClick={() => {
          startRecording();
          setAudioData();
        }}
      >
        <FontAwesomeIcon icon={faMicrophone} size="1x" />
      </button>
    </Popover>
  );
}

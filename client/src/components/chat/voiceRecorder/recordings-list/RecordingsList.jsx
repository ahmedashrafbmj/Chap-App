import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrashAlt,
  faExclamationCircle,
  faArrowUpFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import useRecordingsList from "../hooks/use-recordings-list";
import "./styles.css";
import React, { useState } from "react";
export default function RecordingsList({ audio, sendVoiceRecorder }) {
  const { recordings, deleteAudio } = useRecordingsList(audio);
  // const [data, setData] = useState(false);
  const newRecording = recordings[recordings.length - 1];
  return (
    <div className="recordings-container">
      {/* {recordings.key !== " " ? ( */}
      {recordings.length > 0 ? (
        <>
          <div className="recordings-list">
            {/* after recordings-list */}
            <div className="record">
              <audio controls src={newRecording.audio} />
              <div className="delete-button-container">
                <button
                  className="delete-button"
                  title="Delete this audio"
                  onClick={() => deleteAudio(newRecording.key)}
                >
                  <FontAwesomeIcon icon={faTrashAlt} />
                </button>
                <button
                  style={{ borderRadius: "15px" }}
                  onClick={() => {
                    sendVoiceRecorder(newRecording.audio);
                  }}
                >
                  <FontAwesomeIcon icon={faArrowUpFromBracket} />
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="no-records">
          <FontAwesomeIcon
            icon={faExclamationCircle}
            size="1x"
            color="#f2ea02"
          />
          <span style={{ color: "white" }}>You don't have records</span>
        </div>
      )}
    </div>
  );
}

// {recordings.map((record) => (
//   <div className="record" key={record.key}>
//     <audio controls src={record.audio} />
//     <div className="delete-button-container">
//       <button
//         className="delete-button"
//         title="Delete this audio"
//         onClick={() => deleteAudio(record.key)}
//       >
//         <FontAwesomeIcon icon={faTrashAlt} />
//       </button>
//       <button
//         style={{ borderRadius: "15px" }}
//         onClick={() => {
//           sendVoiceRecorder(record.audio);
//         }}
//       >
//         <FontAwesomeIcon icon={faArrowUpFromBracket} />
//       </button>
//     </div>
//   </div>
// ))}

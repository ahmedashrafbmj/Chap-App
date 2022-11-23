import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import Picker from "emoji-picker-react";
import Image from "./image/Image";
import { v4 as uuid } from "uuid";
import Chatbot from "./chatbot/Chatbot";
import AdminForm from "./userForm/AdminForm";
import DisplayForm from "./userForm/DisplayForm";
import SmileOutlined from "@ant-design/icons/SmileOutlined";
import PictureOutlined from "@ant-design/icons/PictureOutlined";
import { Button, Popover } from "antd";
import "./Form.css";
import ScrollToBottom from "react-scroll-to-bottom";
import VoiceRecorder from "./voiceRecorder/VoiceRecorder";
import ReactAudioPlayer from "react-audio-player";
import VideoInput from "./video/VideoInput";
import RecorderControls from "./voiceRecorder/recorder-controls/RecorderControls";
import RecordingsList from "./voiceRecorder/recordings-list/RecordingsList";
import useRecorder from "./voiceRecorder/hooks/useRecorder";

const Chat = () => {
  const [chosenEmoji, setChosenEmoji] = useState(""); // input emoji
  const [file, setFile] = useState(); // image
  const [isUser, setUser] = useState([]);
  const [yourID, setYourID] = useState(); // user ID
  const [messages, setMessages] = useState([]); // store chat
  const [message, setMessage] = useState(""); // input text

  const [serviceList, setServiceList] = useState([{ service: "" }]); // option input
  const [question, setQuestion] = useState(""); // question input
  const [isbot, setBot] = useState(true);
  const [isReply, setReply] = useState("");
  const [userData, setuserData] = useState();
  // for emojo button
  const [visible, setVisible] = useState(false);
  const [MCQvisible, setMCQVisible] = useState(false);
  const [audioData, setAudioData] = useState();
  // let replyBot;
  // let user1;
  // let user2;
  const { recorderState, ...handlers } = useRecorder();
  const { audio } = recorderState;
  const socketRef = useRef();
  const leave  = ()=>{
    localStorage.removeItem("name","room")
    window.location.reload(true);
  }

  useEffect(() => {
    socketRef.current = io.connect("http://localhost:8000/"); // connection to server

    socketRef.current.on("your id", (id) => {
      // get id of user connecting
      setYourID(id);
      socketRef.current.emit("send id", id);
    });
    // save the id's of the connected user's
    socketRef.current.on("userid", (userID) => {
      console.log("getID", userID);
      receivedID(userID);
    });
    socketRef.current.on("message", (message) => {
      // console.log(message);
      receivedMessage(message);
    });
    socketRef.current.on("userFormInfo", (userForm) => {
      setuserData(userForm);
    });
  }, []);

  // user connected
  function receivedID(getID) {
    setUser((oldUser) => [...oldUser, getID]);
  }

  // commmunication b/w user / stores all chat data

  function receivedMessage(message) {
    // console.log(message);
    setMessages((oldMsgs) => [...oldMsgs, message]);
  }

  // for message
  function handleChange(e) {
    setMessage(e.target.value);
    if (isUser[1] === yourID) {
      setBot(false);
    }
  }
  // set file
  function selectFile(e) {
    setMessage(e.target.files[0].name); // to show file name
    setFile(e.target.files[0]);
  }

  // set emoji in message
  const onEmojiClick = (event, emojiObject) => {
    setChosenEmoji(emojiObject);
    if (chosenEmoji === "") {
      setMessage(message);
    } else {
      setMessage(message.concat(chosenEmoji.emoji)); // emoji + text
      setQuestion(question.concat(chosenEmoji.emoji));
    }
  };

  //add question
  const handleQuestion = (e) => {
    setQuestion(e.target.value);
  };

  // add value to option
  const handleServiceChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...serviceList];
    list[index][name] = value;
    setServiceList(list);
    console.log(serviceList);
  };

  // remove a option
  const handleServiceRemove = (index) => {
    const list = [...serviceList];
    list.splice(index, 1);
    setServiceList(list);
  };

  // update the state for new value
  const handleServiceAdd = () => {
    setServiceList([...serviceList, { service: "" }]);
  };

  //send message to backend
  const sendMessage = async () => {
    // sendUserID(yourID);
    // e.preventDefault();
    // setBot(message);
    if (message !== "") {
      if (file) {
        const messageObject = {
          id: yourID,
          type: "file",
          body: file,
          mimeType: file.type, // file type png jpg
          fileName: file.name,
          key: uuid(),
          time:
            new Date(Date.now()).getHours() +
            ":" +
            new Date(Date.now()).getMinutes(),
        };
        setFile();
        setMessage("");
        await socketRef.current.emit("send message", messageObject);
      }
      let username = localStorage.getItem("name")
      const messageObject = {
        id: yourID,
        type: "text",
        body: message,
        key: uuid(),
        author: username,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };
      setMessage("");
      setChosenEmoji("");
      await socketRef.current.emit("send message", messageObject);
      bot();
    }
  };
  // send question & options
  function sendQuestion(e) {
    e.preventDefault();
    const messageObject = {
      id: yourID,
      type: "text",
      body: question,
      key: uuid(),
    };
    setMessage("");
    setChosenEmoji("");
    setQuestion("");
    socketRef.current.emit("send message", messageObject);
    serviceList.forEach((singleService) => {
      const messageObject = {
        id: yourID,
        type: "option",
        body: singleService.service,
        key: uuid(),
      };
      setServiceList([{ service: "" }]);
      setMessage("");
      setChosenEmoji("");
      socketRef.current.emit("send message", messageObject);
    });
  }
  // reply from bot
  const replyFromBot = (value) => {
    setReply(value);
    // console.log(isReply);
  };
  // Display form data (quiz component)
  const formContent = (data) => {
    // setuserData();
    socketRef.current.emit("send Form", data.user);
  };

  // conformation for form submit
  const quizCompleted = (completed) => {
    console.log(completed);
    const messageObject = {
      id: yourID,
      type: "text",
      body: completed,
      key: "FormSubmit",
      time:
        new Date(Date.now()).getHours() +
        ":" +
        new Date(Date.now()).getMinutes(),
    };
    socketRef.current.emit("send message", messageObject);
  };
  // bot reply
  const bot = async () => {
    if (isUser[1] != null && isbot) {
      // console.log(replyBot);
      if (isReply !== "") {
        const messageObjects = {
          id: isUser[1],
          type: "text",
          author: "Bot",
          body: isReply,
          key: "Bot",
          time:
            new Date(Date.now()).getHours() +
            ":" +
            new Date(Date.now()).getMinutes(),
        };
        // setMessage("");
        await socketRef.current.emit("send message", messageObjects);
      }
    }
  };
  // display content
  function renderMessages(message, index) {
    if (message.type === "file") {
      const blob = new Blob([message.body], { type: message.type });
      return (
        <>
          <div
            key={index}
            className="message"
            id={message.id === yourID ? "other" : "you"}
          >
            <div>
              <div className="message-contents">
                <p>
                  <Image fileName={message.fileName} blob={blob} />
                </p>
              </div>
              <div className="message-meta">
                <p id="time">{message.time}</p>
                <p id="time">{message.author}</p>
                
              </div>
            </div>
          </div>
        </>
      );
    }
    if (message.type === "video") {
      return (
        <>
          <div
            key={index}
            className="message"
            id={message.id === yourID ? "other" : "you"}
          >
            <div>
              <div className="message-contents">
                <p>
                  <video
                    className="VideoInput_video"
                    width={150}
                    height={150}
                    controls
                    src={message.body}
                  />
                </p>
              </div>
              <div className="message-meta">
                <p id="time">{message.time}</p>
              </div>
            </div>
          </div>
        </>
      );
    }
    if (message.type === "audio") {
      return (
        <>
          <div
            key={index}
            className="message"
            id={message.id === yourID ? "other" : "you"}
          >
            <div>
              <div className="message-contents">
                <p>
                  {/* <ReactAudioPlayer src={message.body} autoPlay controls /> */}
                  <audio controls src={message.body} />
                </p>
              </div>
              <div className="message-meta">
                <p id="time">{message.time}</p>
              </div>
            </div>
          </div>
        </>
      );
    }

    if (message.type === "text") {
      if (message.id === yourID) {
        return (
          <>
            <div key={index} className="message" id={"other"}>
              <div>
                <div className="message-content">
                  <p>{message.body}</p>
                </div>
                <div className="message-meta">
                  <p id="time">{message.time}</p>
                  <p id="author">{message.author}</p>
                </div>
              </div>
            </div>
            <p>
              {message.body === "start quiz" && message.key ? (
                <div style={{ marginLeft: "210px" }}>
                  {/* <AdminForm
                    quizCompleted={quizCompleted}
                    formContent={formContent}
                  /> */}
                </div>
              ) : null}
            </p>
          </>
        );
      }
      return (
        <div key={index} className="message" id={"you"}>
          <div>
            <div className="message-content">
              <p>{message.body}</p>
            </div>
            <div className="message-meta">
              <p id="time">{message.time}</p>
              <p id="author">{message.author}</p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <>
        <div
          key={index}
          className="message"
          id={message.id === yourID ? "other" : "you"}
        >
          <div>
            <div key={index} className="message-content">
              {message.id === yourID ? (
                <p>
                  {message.body}
                  <input type="checkbox" checked={message.defaultChecked} />
                </p>
              ) : (
                <p>
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      // console.log(e.target.checked);
                      if (e.target.checked === true) {
                        const messageObject = {
                          id: yourID,
                          type: "text",
                          body: message.body,
                          key: message.key,
                          time:
                            new Date(Date.now()).getHours() +
                            ":" +
                            new Date(Date.now()).getMinutes(),
                        };
                        socketRef.current.emit("send message", messageObject);
                      }
                    }}
                  />
                  {message.body}
                </p>
              )}
            </div>
            <div className="message-meta">
              <p id="time">{message.time}</p>
            </div>
          </div>
        </div>
      </>
    );
  }
  // for emoji
  const content = (
    <Picker onEmojiClick={onEmojiClick} pickerStyle={{ width: "300px" }} />
  );

  const handleVisibleChange = (newVisible) => {
    setVisible(newVisible);
  };
  // for MCQs
  const MCQcontent = (
    <div>
      <input
        value={question}
        onChange={handleQuestion}
        placeholder="Your question.."
      />
      {/* MCQ feature */}
      {/* <form autoComplete="off">
        <div className="form-field">
          {serviceList.map((singleService, index) => (
            <div key={index} className="services">
              <div className="first-division">
                <input
                  name="service"
                  type="text"
                  id="service"
                  value={singleService.service}
                  onChange={(e) => handleServiceChange(e, index)}
                  required
                />
                {serviceList.length - 1 === index && serviceList.length < 4 && (
                  <button type="button" onClick={handleServiceAdd}>
                    <span>Option</span>
                  </button>
                )}
              </div>
              <div className="second-division">
                {serviceList.length !== 1 && (
                  <button
                    type="button"
                    onClick={() => handleServiceRemove(index)}
                  >
                    <span>Remove</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </form> */}
      {/* MCQ feature */}
      {/* <button
        class="btn btn-success"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#collapseExample"
        aria-expanded="false"
        onClick={sendQuestion}
      >
        Save
      </button> */}
    </div>
  );
  const handleVisibleChanges = (newVisible) => {
    setMCQVisible(newVisible);
  };

  // for voice recorder
  const sendVoiceRecorder = async (data) => {
    console.log(data);
    setAudioData(data);
    const messageObject = {
      id: yourID,
      type: "audio",
      body: data,
      key: uuid(),
      time:
        new Date(Date.now()).getHours() +
        ":" +
        new Date(Date.now()).getMinutes(),
    };
    setMessage("");
    await socketRef.current.emit("send message", messageObject);
  };

  // send video to user
  const sendVideo = async (data) => {
    const messageObject = {
      id: yourID,
      type: "video",
      body: data,
      key: uuid(),
      time:
        new Date(Date.now()).getHours() +
        ":" +
        new Date(Date.now()).getMinutes(),
    };
    setMessage("");
    await socketRef.current.emit("send message", messageObject);
  };

  return (
    <>
      <div className="chat-window">
        {/* <DisplayForm userData={userData} /> */}
        <div className="chat-body">
          <Chatbot message={message} replyFromBot={replyFromBot} />
          <ScrollToBottom className="message-container">
            {messages.map(renderMessages)}{" "}
            {/* console.log(renderMessages) */}
          </ScrollToBottom>
        </div>
        <div
          className="chat-footer"
          // onSubmit={(e) => {
          //   e.preventDefault();
          //   sendMessage();
          //   bot();
          //   // setTimeout(bot, 3000);
          // }}
        >
          <input
            type="text"
            value={message}
            placeholder="Hey..."
            onChange={handleChange}
            onKeyPress={(event) => {
              event.key === "Enter" && sendMessage();
            }}
          />
          <Popover
            content={content}
            trigger="click"
            visible={visible}
            onVisibleChange={handleVisibleChange}
          >
            <Button type="primary">
              <SmileOutlined />
            </Button>
          </Popover>
          <div className="wrapper" style={{ marginTop: "10px" }}>
            <label htmlFor="imgClip">
              <PictureOutlined
                style={{ fontSize: "29px", color: "#08c", cursor: "pointer" }}
                theme="outlined"
              />
            </label>
            <input
              onChange={selectFile}
              id="imgClip"
              type="file"
              accept=".jpeg,.png"
              style={{ display: "none", visibility: "none" }}
            ></input>
          </div>
          <Popover
            content={MCQcontent}
            trigger="click"
            visible={MCQvisible}
            onVisibleChange={handleVisibleChanges}
          >
            {/* <Button>MCQ</Button> */}
          </Popover>
          <VideoInput sendVideo={sendVideo} />

          <button
            onClick={(e) => {
              e.preventDefault();
              sendMessage();
            }}
          >
            &#9658;
          </button>
          <RecorderControls
            recorderState={recorderState}
            handlers={handlers}
            setAudioData={setAudioData}
          />

          {/* <VoiceRecorder sendVoiceRecorder={sendVoiceRecorder} /> */}
        </div>
      </div>
      {/* <VoiceRecorder sendVoiceRecorder={sendVoiceRecorder} /> */}
      <button onClick={leave} style={{ color: "white",backgroundColor:"#43a047" }}>Leave Chat</button>

      {audioData ? null : (
        <div className="recorder-container">
          <RecordingsList audio={audio} sendVoiceRecorder={sendVoiceRecorder} />
        </div>
      )}
    </>
  );
};

export default Chat;

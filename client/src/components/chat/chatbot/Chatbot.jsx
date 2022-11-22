import React from "react";
// import AdminForm from "./AdminForm";

const Chatbot = ({ message, replyFromBot }) => {
  const trigger = [
    ["hi", "hey", "hello"],
    ["start quiz", "start", "quiz"],
    ["what is going on", "what is up"],
    ["happy", "good", "amazing", "fantastic", "cool"],
    ["bad", "bored", "tired", "sad"],
    ["thanks", "thank you"],
    ["bye", "good bye", "goodbye"],
  ];

  const reply = [
    ["Hello!", "Hi!", "Hey!"],
    ["Start your quiz", "Start your quiz", "Start your quiz"],
    ["Nothing much", "Exciting things!", "I'm happy to see you!"],
    ["Glad to hear it", "Yayyy!! That's the spirit!"],
    ["There is always a rainbow after the rain!"],
    ["You're welcome", "No problem", "It's my pleasure!"],
    ["Goodbye, it was a nice talk"],
  ];

  // const alternative = [
  //   "Same",
  //   "Go on...",
  //   "Try again please?",
  //   "I'm listening...",
  // ];
  const matchReply = (message) => {
    let botMsg = "";
    let text = message.toLowerCase().replace(/[^\w\s\d]/gi, "");
    text = text
      .replace(/ a /g, " ")
      .replace(/whats/g, "what is")
      .replace(/please /g, "")
      .replace(/ please/g, "");
    if (generateReply(trigger, reply, text)) {
      botMsg = generateReply(trigger, reply, text);
    }
    // else {
    //   botMsg = alternative[Math.floor(Math.random() * alternative.length)];
    // }
    if (botMsg !== "") {
      // console.log(botMsg);
      replyFromBot(botMsg);
    } else {
      replyFromBot("");
    }
  };
  const generateReply = (trigger, reply, input) => {
    let item;
    let items;
    for (let x = 0; x < trigger.length; x++) {
      for (let y = 0; y < trigger[x].length; y++) {
        if (trigger[x][y] === input) {
          items = reply[x];
          item = items[Math.floor(Math.random() * items.length)];
        }
      }
    }
    return item;
  };

  if (message !== "") {
    matchReply(message);
  }
  return (
    <div className="Chatbot">
      {/* {message === "start quiz" ? <AdminForm /> : null} */}
    </div>
  );
};

Chatbot.defaultProps = {
  message: "start quiz",
  replyFromBot: "Start your quiz",
};
export default Chatbot;

import { Button, Modal } from "antd";
import React, { useState } from "react";
import Quiz from "./Quiz";
import "antd/dist/antd.css";
const AdminForm = ({ quizCompleted, formContent }) => {
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  // const [userInfo, setUserInfo] = useState([]);

  const showModal = () => {
    setVisible(true);
  };
  const formData = (data) => {
    // setUserInfo(data.user);
    formContent(data);
  };
  const handleOk = () => {
    setLoading(true);
    quizCompleted("Submited.");
    // setUserInfo((oldInfo) => [...oldInfo, userInfo]);
    // formContent(userInfo);
    setTimeout(() => {
      setLoading(false);
      setVisible(false);
    }, 3000);
  };

  const handleCancel = () => {
    setVisible(false);
  };
  return (
    <div className="adminForm">
      <>
        <Button type="primary" onClick={showModal}>
          Start Quiz
        </Button>
        <Modal
          visible={visible}
          title="Title"
          onOk={handleOk}
          onCancel={handleCancel}
          footer={[
            <Button key="back" onClick={handleCancel}>
              Return
            </Button>,
            <Button
              key="submit"
              type="primary"
              loading={loading}
              onClick={handleOk}
            >
              Submit
            </Button>,
          ]}
        >
          <Quiz formData={formData} />
        </Modal>
      </>
    </div>
  );
};

export default AdminForm;

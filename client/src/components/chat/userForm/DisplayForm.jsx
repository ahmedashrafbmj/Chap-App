import { Collapse } from "antd";
import React from "react";
import "../Form.css";
const { Panel } = Collapse;

const DisplayForm = ({ userData }) => {
  //   const text = `
  //   A dog is a type of domesticated animal.
  //   Known for its loyalty and faithfulness,
  //   it can be found as a welcome guest in many households across the world.
  // `;
  const onChange = (key) => {
    // console.log(key);
  };
  return (
    <div className="DisplayForm">
      <Collapse className="panel" defaultActiveKey={["0"]} onChange={onChange}>
        <Panel header="View User Form" key="1">
          <p>Name : {userData != null ? userData.name : null}</p>
          <p>Email : {userData != null ? userData.email : null}</p>
          <p>Website : {userData != null ? userData.website : null}</p>
          <p>
            Introduction : {userData != null ? userData.introduction : null}
          </p>
        </Panel>
        {/* <Panel header="This is panel header 2" key="2">
          <p>{text}</p>
        </Panel>
        <Panel header="This is panel header 3" key="3">
          <p>{text}</p>
        </Panel> */}
      </Collapse>
    </div>
  );
};

export default DisplayForm;

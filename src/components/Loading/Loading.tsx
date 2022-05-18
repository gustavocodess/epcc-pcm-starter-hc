import React from "react";
import Modal from "antd/lib/modal/Modal";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

interface LoadingProps {
  loading: boolean;
}

const Loading: React.FC<LoadingProps> = ({ loading }) => {
  return (
    <Modal
      visible={loading}
      width="100px"
      closeIcon={false}
      footer={false}
      closable={false}
      centered
      wrapClassName="modal-loading"
    >
      <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }}/>}></Spin>
      <p>Loading...</p>
    </Modal>
  );
};

export default Loading;

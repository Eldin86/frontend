import React from 'react';

import Modal from './Modal';
import Button from '../FormElements/Button';

const ErrorModal = props => {
  return (
    <Modal
      modal={'center-text'}
      onCancel={props.onClear}
      header={props.error || "An Error Occurred!"}
      show={!!props.error}
      footer={<Button onClick={props.onClear} margin='10px'>Okay</Button>}
    >
      <p>{props.error}</p>
    </Modal>
  );
};

export default ErrorModal;

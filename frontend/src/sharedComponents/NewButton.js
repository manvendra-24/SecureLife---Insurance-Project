import React from 'react'
import {Button} from 'react-bootstrap';

const NewButton = ({handleButton, text}) => {
  return (
    <Button className="btn btn-primary btn-block" onClick={handleButton}>
      {text}
    </Button>
  )
}

export default NewButton
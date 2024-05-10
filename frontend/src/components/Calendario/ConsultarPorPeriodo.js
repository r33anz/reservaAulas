import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Container from 'react-bootstrap/Container'; 


function ConsultarPorPeriodo() {

  const periodos = [ 
            "6:45 - 8:15",
            "8:15 - 9:45",
            "9:45 - 11:15",
            "11:15 - 12:45",
            "12:45 - 14:15",
            "14:15 - 15:45",
            "15:45 - 17:15",
            "17:15 - 18:45",
            "20:15 - 21:45"
          ] ;
  return (
    <Container 
      className="modal show"
      style={{ display: 'block', position: 'initial' }}
    >
      <Modal.Dialog>
        <Modal.Header closeButton>
          <Modal.Title>Modal title</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>Modal body text goes here.</p>
          {
            periodos.map(p => <Periodo tiempo={p} />)
          }
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary">Close</Button>
          <Button variant="primary">Save changes</Button>
        </Modal.Footer>
      </Modal.Dialog>
    </Container>
  );
}

function Periodo({tiempo}) {
  return (
    <Container>
      
        <input type='checkBox'/>
        <p>{tiempo}</p>  
      
    </Container>
  )
}

export default ConsultarPorPeriodo;
import React from "react";
import { Container, Row, Col, Figure } from 'react-bootstrap'
import { BellFill, Calendar3 } from 'react-bootstrap-icons'
import logo from '../../assets/images/image.png';
import '../../components/Busquedanombre/Style.css';

const Home = ({ children }) => {
    return (<>
        <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div className="tamaño">
          <span>Intelligence</span>
          <span>Software</span>
        </div>
        <div className="ico">
        <BellFill color="white" size={30}/>
        <Calendar3 color="white" size={30} style={{ marginLeft: '20px' }}/>
        </div>
      </header>
        <Container style={{ paddingTop: "2rem" }}>
            {children}
        </Container>

      
    
    </>);
}

export default Home;
import React from 'react';
import Template from '../common_components/pageTemplate';
import { NavLink } from 'react-router-dom';
import {Card, CardColumns, Row, Col, Button, ListGroup} from 'react-bootstrap';
import imgSeparador from '../../static_files/imgs/separador.png';

class Home extends React.Component {
    constructor(props) {
        console.log('Home->constructor()')
        super(props);
        this.state = {
            secciones: []
        }
    }
    render() {
        console.log('Home->render()')
        return (
            <Template >
                <Row>
                    <Col xs={8}>
                        <img src={imgSeparador} alt="imagen" style={{ width: '100%', height: '4.2ex', margin: '0', padding: '0' }} />
                        <h1 style={{ color: '#EFECEA', textAlign: 'center', fontSize: '3.7ex', fontWeight: 300, margin: '0', padding: '0' }}>Secciones</h1>
                        <img src={imgSeparador} alt="imagen" style={{ width: '100%', height: '4.2ex' }} />
                        <CardColumns>
                            {this.props.secciones.map(sec =>
                                <Card key={sec.idSeccion}>
                                    <Card.Img variant="top" src={"./imgs/" + sec.img} />
                                    <Card.Body>
                                        <Card.Title>{sec.nombreSeccion}</Card.Title>
                                        <Card.Text id="h3Dark">{sec.descripcion}</Card.Text>
                                        <Card.Footer>
                                            <NavLink to={`/secciones/${sec.idSeccion}/${sec.nombreSeccion}`}>
                                                <Button variant="outline-primary" >Ir a la sección</Button>
                                            </NavLink>
                                        </Card.Footer>
                                    </Card.Body>
                                </Card>
                            )}
                        </CardColumns>
                    </Col>
                </Row>
            </Template>
        )
    }
}

export default Home;
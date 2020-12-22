import React from 'react';
import { IoLogoYoutube, IoLogoTwitter, IoLogoGoogle, IoIosListBox, IoIosLogIn, IoMdSearch, IoIosPerson, IoIosLogOut, IoIosSettings } from 'react-icons/io';
import { Form, Navbar, FormControl, Button, ButtonGroup, Nav, Col } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import logo from '../../static_files/imgs/logouna.png';

export default class Head extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      palBusqueda: '',
    }
    this.handleChange = this.handleChange.bind(this)
    this.checkInputs = this.checkInputs.bind(this)
  }
  /*buscarTema = (palabra) => {
    return new Promise((res, rej) => {
      doRequest('GET', '/searching/' + palabra)
        .then(rta => {
          res(rta)
        })
        .catch(err => console.log('Error: ' + err));
    })
  }*/
  checkInputs(event) {
    let palBusqueda = this.state.palBusqueda.trim();
    if (palBusqueda === null || palBusqueda === '' || palBusqueda.length > 40) {
      event.preventDefault()
      event.stopPropagation()
      return false
    }
    /* this.buscarTema(palBusqueda)    
        .then(async (rta) => {
          this.props.dispatchResults(rta)
        })
        .catch((err) => {
          return ('Error en ComponentDidMount() (' + err + ')')
        });*/
  }
  handleChange(event) {
    this.setState({ palBusqueda: event.target.value });
  }
  render() {
    return (
      <Navbar sticky="top" bg="dark" variant="dark" expand="lg" className="pt-1 pb-1" >

        <Col md="auto" className="mr-0 pr-0">
          <NavLink to="/" className="valign-wrapper brand-Logo mr-0 pr-0">
            <img src={logo} alt="imagen" width="60" className="d-inline-block align-top pr-0 mr-0" />
          </NavLink>
        </Col>

        <Col className="ml-0 pl-0" lg={3}>
          <h6 style={{ color: '#ecc538' }} className="ml-0 pl-0">Universidad Nacional de las Artes</h6>
        </Col>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Col>
          <Navbar.Collapse id="basic-navbar-nav">

            <Form inline className="mr-auto ml-auto" >
              <FormControl type="text" placeholder="buscar en el sitio" className="mr-sm-2" value={this.state.palBusqueda} onChange={this.handleChange} />
              <NavLink onClick={this.checkInputs} to={`/searching/${this.state.palBusqueda}`}>
                <Button variant="outline-info" >
                  <IoMdSearch className="mr-2" />
              Buscar
              </Button>
              </NavLink>
            </Form>

            <Nav className="ml-auto" >

              <ButtonGroup vertical>
                <NavLink to="/register">
                  <Button variant="outline-info" className="pt-1 pb-1 pr-4">
                    <IoIosListBox className="mr-2" />
                    Registrarse
                  </Button>
                </NavLink>
                <NavLink to="/loggin">
                  <Button variant="outline-info" className="pt-1 pb-1">
                    <IoIosLogIn /> Iniciar Sesión
                  </Button>
                </NavLink>
              </ButtonGroup>

              <Col className="ml-2 mr-0" md="auto" lg={1}>
                <Nav.Link href='#' className="mt-0 mb-0 pt-0 pb-0"><IoLogoYoutube style={{ color: "rgb(23,162,184)" }} size={20} className="mt-0 mr-0 pr-0 mb-0 pt-0 pb-0" /> </Nav.Link>
                <Nav.Link href='#' className="mt-0 mb-0 pt-0 pb-0 mr-0"><IoLogoTwitter style={{ color: "rgb(23,162,184)" }} size={20} className="mt-0 mb-0 mr-0 pt-0 pb-0" /> </Nav.Link>
                <Nav.Link href='#' className="mt-0 mb-0 pt-0 pb-0 mr-0"><IoLogoGoogle style={{ color: "rgb(23,162,184)" }} size={20} className="mt-0 mb-0 mr-0 pt-0 pb-0" /> </Nav.Link>
              </Col>
            </Nav>
          </Navbar.Collapse>
        </Col>

      </Navbar>
    )
  }
}
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import {  IoIosMail, IoLogoFacebook, IoLogoYoutube, IoIosGlobe, IoIosCreate, IoIosCamera, IoMdKey,IoIosPerson } from 'react-icons/io'
import { Form, Col, Button, Modal, Row } from 'react-bootstrap';
import Template from '../common_components/pageTemplate';
import ApodoField from '../common_components/apodoField';

class RegisterForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            registrado: false,
            submitOk: false,
            avisoApodoRepe: false,
            apodo: '',
            mail: '',
            face: '',
            blog: '',
            youtube: '',
            pass1: '',
            pass2: '',
            avatar: '',
            msj: '',
            archivo: null,
            showModal: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.checkInputs = this.checkInputs.bind(this);
        this.handleImg = this.handleImg.bind(this)
        this.checkApodo = this.checkApodo.bind(this)
    }
    handleImg(e) { this.setState({ archivo: e.target.files[0] }) }
    checkInputs() {
        if (this.state.apodo === null || this.state.apodo === '') {
            this.setState({ msj: 'completa el apodo' })
            return false;
        }
        if (this.state.mail === null || this.state.mail === '') {
            this.setState({ msj: 'completa el mail' })
            return false;
        }
        if (this.state.pass1 === null || this.state.pass1 === '' || this.state.pass2 === null || this.state.pass2 === '') {
            this.setState({ msj: 'debes completar las contraseñas' })
            return false;
        }
        if (this.state.pass1 !== this.state.pass2) {
            this.setState({ msj: 'ambas contraseñas deben coincidir' })
            return false;
        }
        if (this.state.pass1.length < 6 || this.state.pass1.length>8) {
            this.setState({ msj: 'la contraseña debe tener entre 6 y 8 caracteres' })
            return false;
        }
        return true;
    }
    handleShow() {
        this.setState({ showModal: true })
    }
    checkApodo() {
        /*if (this.state.apodo !== null || this.state.apodo !== '') {
            doRequest('GET', '/checkapodo/' + this.state.apodo )
                .then(rta => {
                    if (!rta.disponible) {
                        this.setState({ avisoApodoRepe: true})
                    }
                    //console.log('-->Regisster.js->checkApodo-rta: '+JSON.stringify(rta))
                })
                .catch(err => {
                    //console.log('-->Regisster.js->checkApodo-err: '+JSON.stringify(err))
                    this.setState({ msj: err.message });
                });
        }*/                
    }
    handleClose() {
        this.setState({ showModal: false });
        if (this.state.submitOk) this.setState({ registrado: true });
    }
    handleChange(e) {
        this.setState({[e.target.name]:e.target.value})
    }
    handleAvatar(evento) {
        this.setState({ avatar: evento.target.files[0] })
    }
    handleSubmit(event) {
        event.preventDefault();
        var data = new FormData(event.target);
        if (this.checkInputs()) {
            doRequest('POST', '/user', data, false)
                .then(rta => {
                    this.setState({ submitOk: true });
                    this.setState({ msj: rta.msj })
                })
                .catch(err => {
                    this.setState({ msj: err.message });
                });
        }
        this.handleShow();
    }
    render() {
        return this.state.registrado ? (<Redirect to="/" />) : (
            <Template>
                <Form onSubmit={this.handleSubmit}>
                    <ApodoField sobreClick={this.onClick} sobreBlur={this.checkApodo} manejarCambio={this.handleChange} apodo={this.state.apodo}  />

                    <Form.Group as={Row} className="mt-5" >
                        <Form.Label sm={4} className="mr-1 pt-1">
                            <h5><IoIosMail style={{ marginBottom: "0.2em", marginRight: "0.4em" }} />E-Mail</h5>
                        </Form.Label>
                        <Col sm={6}>
                            <Form.Control placeholder="indica una dirección de mail para contactarte" name="mail" type="email" id="email" maxLength={62} onChange={this.handleChange} value={this.state.mail} />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mt-5">
                        <Form.Label sm={4} className="mr-1 pt-1">
                            <h5><IoLogoFacebook style={{ marginBottom: "0.2em", marginRight: "0.4em" }} />Facebook</h5>
                        </Form.Label>
                        <Col sm={6}>
                            <Form.Control placeholder="si quieres dar a conocer tu facebook" id="face" name="facebook" onChange={this.handleChange} maxLength={118} value={this.state.redSoc1} />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mt-5">
                        <Form.Label sm={4} className="mr-1 pt-1">
                            <h5><IoIosGlobe style={{ marginBottom: "0.2em", marginRight: "0.4em" }} />Blog personal</h5>
                        </Form.Label>
                        <Col sm={6}>
                            <Form.Control placeholder="si quieres dar a conocer tu blog o página web" id="blg" name="blog" onChange={this.handleChange} maxLength={118} value={this.state.redSoc2} />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mt-5">
                        <Form.Label sm={4} className="mr-1 pt-1 text-center">
                            <h5><IoLogoYoutube style={{ marginBottom: "0.2em", marginRight: "0.4em" }} />Youtube</h5>
                        </Form.Label >
                        <Col sm={6}>
                            <Form.Control placeholder="si quieres dar a conocer tu canal de youtube" id="yout" name="youtube" onChange={this.handleChange} maxLength={118} value={this.state.redSoc3} />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mt-5">
                        <Form.Label sm={4} className="mr-1 pt-1"><h5><IoIosCamera style={{ marginBottom: "0.2em", marginRight: "0.4em" }} />Sube opcionalmente una imagen que te identifique como miembro</h5> </Form.Label >
                        <Col sm={6} style={{ color: 'rgba(230,240,255)' }}>
                            <Form.Control id="avatar" name="imgAvatar" onChange={this.handleImg} as='input' type='file' />
                            <div id="h7">Escoge una imgen no mayor a 10 KB</div>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mt-5">
                        <Form.Label className="mr-1 pt-1"><h5><IoMdKey style={{ marginBottom: "0.2em", marginRight: "0.4em" }} />Elige una contraseña</h5></Form.Label>
                        <Col sm={4}>
                            <Form.Control type="password" name="pass1" placeholder="6 caracteres mínimo y 8 como máximo" maxLength={8} onChange={this.handleChange} value={this.state.pass1} />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} >
                        <Form.Label className="mr-1 pt-1"><h5><IoMdKey style={{ marginBottom: "0.2em", marginRight: "0.4em" }} />Confirma la contraseña</h5></Form.Label>
                        <Col sm={4}>
                            <Form.Control type="password" name="pass2" placeholder="repite la contraseña" maxLength={8} onChange={this.handleChange} value={this.state.pass2} />
                        </Col>
                    </Form.Group>

                    <Button variant="outline-info" type="submit" className="mb-3 mt-4">
                        <IoIosCreate style={{ marginBottom: "0.2em", marginRight: "0.4em" }} />Registrarse
                    </Button>

                    <Modal show={this.state.showModal} onHide={this.handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Registrarse</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <p style={{ color: 'rgb(5,6,28' }}>{this.state.msj}</p>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="primary" onClick={this.handleClose}>Ok</Button>
                        </Modal.Footer>
                    </Modal>
                </Form>
            </Template>
        )
    }
}

export default RegisterForm;
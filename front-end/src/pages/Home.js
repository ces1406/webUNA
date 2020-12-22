import React from 'react';
import Template from '../common_components/pageTemplate'

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
                < h1 > CACA </h1>
            </Template >
        )
    }
}

export default Home;
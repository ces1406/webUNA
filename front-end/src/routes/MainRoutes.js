import React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import Registration from '../pages/Registration';
import Login from '../pages/Login';
import Home from '../pages/Home';
import CommonSection from '../pages/CommonSection';
import Apuntes from '../pages/Apuntes';
import Catedras from '../pages/Catedras';
import UserSettings from '../pages/UserSettings';
import Searching from '../pages/Searching';
import {doSimpleCorsGetRequest} from '../api_requests/requests';

function SomeSection({ match }) {
    switch (match.params.nameSec) {
        case 'Opiniones de cátedras y profesores':
            return <Catedras sec={match.params.idSec} name={match.params.nameSec} />
        case 'Apuntes':
            return <Apuntes sec={match.params.idSec} name={match.params.nameSec} />
        default:
            return <CommonSection sec={match.params.idSec} name={match.params.nameSec} />
    }
}

class MainRoutes extends React.Component {    
    constructor(props){
        super(props);
        this.state={
            sections: []
        }    
    }
    componentDidMount() {
        this.getSections();
    }
    getSections() {
        doSimpleCorsGetRequest('GET','/sections')
        .then(rta=>this.setState({sections:rta}))
        .catch(err=>console.log('Error - '+err));
    }
    render() {
        return (         
            <Router>   
                <Switch>                 
                    <Route path="/" exact> <Home secs={this.state.sections}/> </Route>
                    <Route path={"/secciones/:idSec/:nameSec"} component={SomeSection} />
                    <Route path="/register" component={Registration}></Route>
                    <Route path="/loggin" component={Login}></Route>
                    <Route path="/settings"><UserSettings/> </Route>
                    <Route path="/searching/:unaPalabra" component={props=><Searching palabra={props.match.params.unaPalabra}/>}></Route>              
                </Switch>                    
            </Router>  
        )
    }
}
export default MainRoutes
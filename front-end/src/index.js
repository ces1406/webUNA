import React from 'react';
import ReactDOM from 'react-dom';
import App from './app.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import CSS from "../static_files/index.css";

class Index extends React.Component{
    render(){
        console.log('Index->render()')
        return(
            <App />
        )
    }
}

ReactDOM.render(<Index/>,document.getElementById('root'));
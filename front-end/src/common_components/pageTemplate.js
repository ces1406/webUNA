import React from 'react';
import Header from './header';

class Template extends React.Component{
    render(){
        return (
            <div >
                <Header />
                <div className="container" >
                    {this.props.children}
                </div>
            </div>
        )
    }
}

export default Template
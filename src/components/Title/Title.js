import React from 'react';
import './Title.scss';

class Title extends React.Component {
    render(){
        if(this.props.name){
            switch (this.props.type) {
                case "large":
                    return <h1>{this.props.name}</h1>
                    break;
    
                case "medium":
                    return <h3>{this.props.name}</h3>
                    break;
    
                case "small":
                    return <h5>{this.props.name}</h5>
                    break;
            
                default:
                    return <p><strong>{this.props.name}</strong></p>
                    break;
            }
        }else{
            return;
        }
    }
}

export default Title;
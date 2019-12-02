import React from 'react';
import './Button.scss';;

class Button extends React.Component {
    constructor(props) {
        super(props);
        this.state = {isToggleOn: false};
        // This binding is necessary to make `this` work in the callback
        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount() {
        
    }
  
    componentWillUnmount() {
  
    }

    handleClick(){
        this.props.onButtonClick(!this.state.isToggleOn);
        this.setState(state => ({
            isToggleOn: !state.isToggleOn
        }));
    }

    render(){
        if(this.props.value){
            return (
            <button value={this.props.value} onClick={this.handleClick}>
                {this.props.text}
            </button>
            );
        }else{
            return ""
        }
    }
}

export default Button;

import React, { useState }from 'react';
import './Button.scss';;

function Button(props) {
    const [toggle, setToggle] = useState(false);

    const handleClick = () => {
        props.onButtonClick(!this.state.isToggleOn);
        this.setState(state => ({
            isToggleOn: !state.isToggleOn
        }));
    }

    const buildButton = () => {
        if(props.value){
            return (
            <button value={props.value} onClick={this.handleClick}>
                {props.text}
            </button>
            );
        }else{
            return ""
        }
    }

    render(
        buildButton()
    )
}

export default Button;

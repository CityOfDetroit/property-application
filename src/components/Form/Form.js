import React from 'react';
import './Form.scss';

class Form extends React.Component {
    constructor(props) {
        super(props);
        this.state = {used: false};
    }

    componentDidMount() {
        
    }
  
    componentWillUnmount() {
  
    }

    render(){
        let formType = "Form";
        if (this.props.type){
            formType += ` ${this.props.type}`;
            return (
                <form className={formType}>
                </form>
            )
        }else{
            return (
                <form className="Form default">
                </form>
            )
        }
    }
}

export default Form;

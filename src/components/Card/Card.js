import React from 'react';
import './Card.scss';
import Form from '../Form/Form';
import Title from '../Title/Title';
import Body from '../Body/Body';
import Button from '../Button/Button';

class Card extends React.Component {
    constructor(props) {
        super(props);
        this.handleButtonClick = this.handleButtonClick.bind(this);
        this.state = {used: false};
    }

    componentDidMount() {
        
    }
  
    componentWillUnmount() {
  
    }

    handleButtonClick(status) {
        this.setState({used: status});
        this.props.onStateChange(this.state.used);
    }

    buildForms(forms){
        const markup = forms.map((form) =>
            <Form  
                key={form.toString()} 
                type={form.type}
                requirements={form.requirements}
                text={form.text}
                sections={form.sections}>
            </Form>
        );
        return markup;
    }

    render(){
        let cardType = "Card";
        if (this.props.type){
            cardType += ` ${this.props.type}`;
            return (
                <article className={cardType}>
                    <Title type={this.props.titleType} name={this.props.title}></Title>
                    <Body type={this.props.bodyType} content={this.props.body}></Body>
                    <Button 
                        value={this.props.buttonType} 
                        text={this.props.button}
                        onButtonClick={this.handleButtonClick}>
                    </Button>
                    {this.buildForms(this.props.forms)}
                </article>
            )
        }else{
            return (
                <article className="card default">
                    <Button></Button>
                    <Title name={this.props.title}></Title>
                    <Body></Body>
                </article>
            )
        }
    }
}

export default Card;

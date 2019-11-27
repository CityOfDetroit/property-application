import React from 'react';
import './Card.scss';
import Title from '../Title/Title';
import Body from '../Body/Body';
import Button from '../Button/Button';

class Card extends React.Component {
    render(){
        let cardType = "Card";
        if (this.props.type){
            cardType += ` ${this.props.type}`;
            return (
                <article className={cardType}>
                    <Button value="close" text="x"></Button>
                    <Title type={this.props.titleType} name={this.props.title}></Title>
                    <Body type={this.props.bodyType} content={this.props.body}></Body>
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

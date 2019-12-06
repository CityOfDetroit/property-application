import React from 'react';
import './Card.scss';
import Title from '../Title/Title';
import Body from '../Body/Body';

class Card extends React.Component {

    render(){
        let cardType = "Card";
        if (this.props.type){
            cardType += ` ${this.props.type}`;
            return (
                <article className={cardType}>
                    <Title type={this.props.titleType} name={this.props.title}></Title>
                    <Body type={this.props.bodyType} content={this.props.body}></Body>
                </article>
            )
        }else{
            return (
                <article className="card default">
                    <Title name={this.props.title}></Title>
                    <Body type={this.props.bodyType} content={this.props.body}></Body>
                </article>
            )
        }
    }
}

export default Card;

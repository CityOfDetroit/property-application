import React from 'react';
import './Card.scss';
import Title from '../Title/Title';

class Card extends React.Component {
    render(){
        let cardType = "card";
        if (this.props.type){
            cardType += ` ${this.props.type}`;
            return (
                <article className={cardType}>
                    <Title type="large" name={this.props.title}></Title>
                </article>
                
            )
        }else{
            return (
                <article className="card default">
                    <Title name={this.props.title}></Title>
                </article>
            )
        }
    }
}

export default Card;

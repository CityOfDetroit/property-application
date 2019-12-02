import React from 'react';
import './Body.scss';;

class Body extends React.Component {
    buildContent(){
        const markup = this.props.content.map((item) =>
            <item.tag key={item.id.toString()}>{item.content}</item.tag>
        );
        return markup;
    }

    render(){
        let bodyType = "Card-Body";
        if (this.props.type){
            bodyType += ` ${this.props.type}`;
            return (
                <article className={bodyType}>
                    {this.buildContent()}
                </article>
            )
        }
    }
}

export default Body;

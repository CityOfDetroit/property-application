import React from 'react';
import './Body.scss';

function Body(props) {
    const buildContent = () => {
        const markup = props.content.map((item) =>
            <item.tag key={item.id}>{item.content}</item.tag>
        );
        return markup;
    }

    const buildBody = () => {
        let bodyType = "Card-Body";
        if (props.type){
            bodyType += ` ${props.type}`;
            return (
                <article className={bodyType}>
                    {buildContent()}
                </article>
            )
        }else{
            return ""
        }
    }

    return(
        buildBody()
    )
}

export default Body;

import React from 'react';
import './Status.scss';
import Card from '../Card/Card';

function Status(props) {

    const buildStatus = () => {
        let message = buildStatusMessage();
        return <Card  
        key={message.id} 
        type={message.type} 
        title={message.title.value} 
        titleType={message.title.type} 
        body={message.body.markup} 
        bodyType={message.body.type}>
        </Card>;
    }

    const buildStatusMessage = () => {
        let tempCard = {   
            "id"        : "status-1-card-0",
            "type"      : "center pop-up",
            "title"     : {
                "type"  : "Medium",
                "value" : null
            },
            "body"   : {
                "type"      : "text",
                "markup"    : [
                    {
                        "id"        : "card-0-body-0",
                        "tag"       : "p",
                        "content"   : "The current status of your application is:" 
                    },
                    {
                        "id"        : "card-0-body-1",
                        "tag"       : "strong",
                        "content"   : props.status
                    }
                ]
            }
        };
        return tempCard;
    }

    return(
        buildStatus()
    )
}

export default Status;

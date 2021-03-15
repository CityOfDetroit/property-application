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
            "id"        : "step-0-status-card-0",
            "type"      : "center pop-up",
            "title"     : {
                "type"  : "medium",
                "value" : "Status Test"
            },
            "body"   : {
                "type"      : "text",
                "markup"    : [
                    {
                        "id"        : "status-card-0-body-0",
                        "tag"       : "p",
                        "content"   : "Here is what you can expect:" 
                    },
                    {
                        "id"        : "status-card-0-body-1",
                        "tag"       : "ul",
                        "content"   : [
                            {
                                "id"        : "status-card-0-body-1-list-0",
                                "tag"       : "p",
                                "content"   : "This intake application should take 30-45 minutes" 
                            },
                            {
                                "id"        : "status-card-0-body-1-list-1",
                                "tag"       : "p",
                                "content"   : "This process includes a review by the various stakeholders and City Departments and final approval by the Detroit City Council" 
                            },
                            {
                                "id"        : "status-card-0-body-1-list-2",
                                "tag"       : "p",
                                "content"   : "For simple transactions, the sales process often takes four months from time of application until close." 
                            },
                            {
                                "id"        : "status-card-0-body-1-list-3",
                                "tag"       : "p",
                                "content"   : "Check application status by saving the assigned application ID and logging in to the property intake form application." 
                            },
                            {
                                "id"        : "status-card-0-body-1-list-4",
                                "tag"       : "p",
                                "content"   : "You can finish previously started applications by going to the Finish Previous Application section and providing your application ID." 
                            }
                        ]
                    },
                    {
                        "id"        : "status-card-0-body-2",
                        "tag"       : "p",
                        "content"   : [
                            {
                                "id"        : "status-card-0-body-2-item-0",
                                "tag"       : "strong",
                                "content"   : "SAVE YOUR APPLICATION ID!" 
                            }
                        ]
                    },
                    {
                        "id"        : "status-card-0-body-3",
                        "tag"       : "p",
                        "content"   : [
                            {
                                "id"        : "status-card-0-body-3-item-0",
                                "tag"       : "strong",
                                "content"   : "Incomplete applications will be saved in the system for 30 days." 
                            }
                        ]
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

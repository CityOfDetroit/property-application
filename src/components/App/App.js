import React, { useState }from 'react';
import './App.scss';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import Card from '../Card/Card';
import Form from '../Form/Form';
import data from '../../data/digital.divide.survey.json';
import token from '../../../local/survey_token.json';
import Status from '../Status/Status';

function App() {
    const [appID, setAppID]             = useState();
    const [stepHistory, setStepHistory] = useState([]);
    const [step, setStep]               = useState(0);
    const [formData, setFormData]       = useState();
    const [buildType, setBuildType]     = useState('application');
    const [btnState, setbtnState]       = useState();
    const [hint, setHint]               = useState();
    const [status, setStatus]           = useState();

    const buildContent = () => {
        const markup = 
        <ErrorBoundary>
            <section id="App">
                <article className="Panel">
                    {buildPanel()}
                </article>
            </section>
        </ErrorBoundary>
        return markup;
    }

    const restartApp = (e) => {
        e.preventDefault();
        if(btnState == 'Save & Exit') {
            setAppID(undefined);
            setStepHistory([]);
            setFormData(undefined);
            setBuildType('application');
            setStep(0);
        }else{
            if(stepHistory[stepHistory.length - 1] == 0){
                setAppID(undefined);
            }
            let tempStep = stepHistory[stepHistory.length - 1];
            let tempHistory = stepHistory;
            tempHistory.pop();
            setStepHistory(tempHistory);
            setStep(tempStep);
        }
    }

    const buildHeader = (items) => {
        const markup = items.header.map((header) =>
            <div key={header.id} className="header">
                <p><img src={header.logoURL} alt={header.logoAlt}></img> <span>{header.text}</span></p>
                <form onSubmit={restartApp}>
                    {(step > 0) ? <button className="back" onClick={(e)=>{setbtnState(e.target.innerText)}}><span>&laquo;</span> Back</button> : ""}
                    <button className="restart" onClick={(e)=>{setbtnState(e.target.innerText)}}>Save & Exit</button>
                </form>
            </div>
        );
        return markup;
    }

    const buildPanel = () => {
        const markup = 
        <section className="intake">
            {buildHeader(data[buildType][step].items)}
            <section className="intake-container">
                <article className="intake-body">
                    {(status != undefined) ? buildStatus() : ''}
                    {buildAppIDCard()}
                    {buildCards(data[buildType][step].items)}
                </article>
                {buildForms(data[buildType][step].items)}
                {buildHints(data[buildType][step].items)}
            </section>
        </section>
        return markup;
    }

    const buildStatus = () => {
        return <Status
                status={status}
                ></Status>;
    }

    const buildAppIDCard = () => {
        let tempBody = [
            {
                "id"        : "app-id-0-body-0",
                "tag"       : "small",
                "content"   : "(Remember to keep this ID for your records)"
            },
            {
                "id"        : "app-id-0-body-0",
                "tag"       : "br",
                "content"   : ""
            },
            {
                "id"        : "app-id-0-body-1",
                "tag"       : "b",
                "content"   : "Application ID: " 
            },
            {
                "id"        : "app-id-0-body-2",
                "tag"       : "span",
                "content"   : `${appID}`
            }
        ];
        if(appID != undefined && step >= 2){
            return <Card  
                key="app-id-card" 
                type="right pop-up color-2"
                title={null}
                titleType={null}
                body={tempBody} 
                bodyType="text">
            </Card>;
        }
    }

    const buildHints = (items) => {
        let hintClass;
        if(hint) {hintClass = "intake-hint active"}else{hintClass = "intake-hint"}
        const markup = 
        <article className={hintClass}>
            {(data[buildType][step].items.hints.length > 0) ? <button className="hint-btn show-hint" onClick={(e)=>{setHint(true)}}><i className="far fa-lightbulb"></i><br></br><small>Hint</small></button> : '' }
            <article className="intake-hint-group">
                {(data[buildType][step].items.hints.length > 0) ? <button className="hint-btn close-hint" onClick={(e)=>{setHint(undefined)}}><i className="fas fa-times"></i></button> : '' }
                {buildHint(items)}
            </article>
        </article>;
        return markup;
    }

    const buildHint = (items) => {
        const markup = items.hints.map((card) =>
        <Card  
            key={card.id} 
            type={card.type} 
            title={card.title.value} 
            titleType={card.title.type} 
            body={card.body.markup} 
            bodyType={card.body.type}>
        </Card>
        );
        return markup;
    }

    const buildCards = (items) => {
        const markup = items.cards.map((card) =>
            <Card  
                key={card.id} 
                type={card.type} 
                title={card.title.value} 
                titleType={card.title.type} 
                body={card.body.markup} 
                bodyType={card.body.type}>
            </Card>
        );
        return markup;
    }

    const buildForms = (items) => {
        const markup = items.forms.map((form) =>
            <Form
                id={form.id}
                savedData={form.savedData}
                key={form.id} 
                type={form.type}
                position={form.position}  
                requirements={form.requirements}
                text={form.text}
                sections={form.sections}
                token={token}
                state={{ status: [status, setStatus], formData: [formData, setFormData], step: [step, setStep], stepHistory: [stepHistory, setStepHistory], buildType: [buildType, setBuildType], appID: [appID, setAppID] }}>
            </Form>
        );
        return markup;
    }

    return(
        buildContent()
    )
}

export default App;


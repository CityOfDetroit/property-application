import React, { useState }from 'react';
import './App.scss';
import Card from '../Card/Card';
import Form from '../Form/Form';
import data from '../../data/App.steps.json';

function App() {
    const [step, setStep] = useState(0);
    const [used, setUsed] = useState(false);

    const buildContent = () => {
        const markup = 
        <article id="App">
            {buildCards(data.steps[step].items)}
            {buildForms(data.steps[step].items)}
        </article>
        return markup;
    }

    const handleSubmit = () => {
        console.log('submited');
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
                key={form.id} 
                type={form.type} 
                requirements={form.requirements}
                text={form.text}
                sections={form.sections}
                onSubmit={handleSubmit}>
            </Form>
        );
        return markup;
    }
  
    const updateStep = (e) => {
        let newState = step;
        if(e){
            newState++;
        }else{
            newState--;
        }
        setStep(newState);
    }

    return(
        buildContent()
    )
}

export default App;


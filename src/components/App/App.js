import React, { useState }from 'react';
import './App.scss';
import Card from '../Card/Card';
import Form from '../Form/Form';
import data from '../../data/App.steps.json';

function App() {
    const [step, setStep] = useState(0);
    const [formData, setFormData] = useState();

    const buildContent = () => {
        const markup = 
        <section id="App">
            <article className="Panel">
            {buildCards(data.steps[step].items)}
            {buildForms(data.steps[step].items)}
            </article>
        </section>
        return markup;
    }

    const handleSubmit = (data) => {
        console.log(data);
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
                position={form.position}  
                requirements={form.requirements}
                text={form.text}
                sections={form.sections}
                onSubmit={handleSubmit}
                state={{ formData: [formData, setFormData], step: [step, setStep] }}>
            </Form>
        );
        return markup;
    }

    return(
        buildContent()
    )
}

export default App;


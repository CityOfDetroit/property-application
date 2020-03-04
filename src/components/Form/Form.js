import React, { useState } from 'react';
import './Form.scss';
import Body from '../Body/Body';

function Form({type, requirements, text, sections, onSubmit}) {

    const [questionState, setQuestion] = useState([
        {question: '', value: ''}
    ]);

    const buildContent = () => {
        const markup = 
        <form className={type} onSubmit={handleSubmit}>
            <Body type={text.type} content={text.markup}></Body>
            {buildSections()}
        </form>
        return markup;
    }

    const buildSections = () => {
        const markup = sections.map((section) =>
           <fieldset key={section.id}>
               {buildItems(section.items)}
           </fieldset>
        );
        return markup;
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(e);
    }

    const buildItems = (items) => {
        const markup = items.map((item) => {
            questionState.map((val, idx) => {
                const qID = `question-${idx}`;
                return (
                    <div key={item.key}>
                        {(item.label) ? <label htmlFor={idx}>{item.labelText}</label> : ''}
                        <item.tag
                            key={qID} 
                            type={item.type}>
                            {item.text}
                        </item.tag>
                    </div>
                );      
            });
        });
        return markup;
    }

    return (
        buildContent(sections)
    )
}

export default Form;

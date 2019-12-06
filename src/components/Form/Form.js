import React, { useState } from 'react';
import './Form.scss';

function Form({type, requirements, text, sections, onSubmit}) {


    const buildSections = (items) => {
        const markup = items.map((item) =>
            <item.tag id={item.id} type={item.type}>{item.text}</item.tag>
        );
        return markup;
    }

    const buildContent = () => {
        const markup = 
        <form className={type} onSubmit={onSubmit}>
            {buildSections(sections)}
        </form>
        return markup;
    }

    return (
        buildContent()
    )
}

export default Form;

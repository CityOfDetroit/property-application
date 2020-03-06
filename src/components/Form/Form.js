import React, { useState } from 'react';
import './Form.scss';
import Body from '../Body/Body';

function Form(props) {

    const {
        step: [step, setStep],
        formData: [formData, setFormData],
        buildType: [buildType, setBuildType]
    } = {
        step: useState(0),
        formData: useState(0),
        buildType: useState(0),
        ...(props.state || {})
    };
    const [btnState, setbtnState] = useState();
    const [agents, setAgents] = useState(0);
    const [otherInput, setOtherInput] = useState();

    const buildContent = () => {
        const formClass = `${props.type} ${props.position}`; 
        const markup = 
        <form className={formClass} onSubmit={handleSubmit}>
            <Body type={props.text.type} content={props.text.markup}></Body>
            {buildSections()}
        </form>
        return markup;
    }

    const buildSections = () => {
        const markup = props.sections.map((section) =>
           <fieldset key={section.id}>
               {buildItems(section.items)}
               {buildAgents()}
               {(agents > 0) ? <button type="submit" onClick={(e)=>{setbtnState(e.target.innerText)}}>Done</button> : ''}
           </fieldset>
        );
        return markup;
    }

    const buildAgents = () => {
        let agentsArr = [];
        for (let index = 0; index < agents; index++) {
            agentsArr.push(`agent-${index}`);
        }
        const markup = agentsArr.map((agent) =>
            <div key={agent}>
                <label htmlFor={agent}>Name:</label>
                <input id={agent} type="text" placeholder="Enter First and Last name." required></input>
            </div>
        );
        return markup;
    }

    const buildOtherInputOption = (e) => {
        let input = document.createElement('input');
        input.type = 'text';
        input.placeholder = `Enter ${e.id}`;
        input.setAttribute('id', `${e.id}-input`);
        input.setAttribute('name', e.name);
        return input;
    }

    const buildItems = (items) => {
        const markup = items.map((item) => 
            <div key={item.id}>
                {(item.label) ? <label htmlFor={item.id}>{item.labelText}</label> : ''}
                {buildTag(item)}
            </div>
        );
        return markup;
    }

    const buildTag = (item) =>{
        let markup;
        switch (item.tag) {
            case 'button':
                switch (item.type) {
                    case 'submit':
                        markup = <button onClick={(e)=>{setbtnState(e.target.innerText)}} type={item.type}>{item.text}</button>;
                        break;
    
                    case 'add':
                        markup = <button onClick={()=>{setAgents(agents + 1)}} type={item.type}>{item.text}</button>;
                        break;
                
                    default:
                        break;
                }
                break;
        
            default:
                switch (item.type) {
                    case 'radio':
                        markup = <input type={item.type} id={item.id} name={item.name} value={item.value} onChange={handleChange} required></input>;
                        break;
                    
                    case 'text':
                        markup = <input type={item.type} id={item.id} name={item.name} value={item.value} disabled={item.disabled} placeholder={item.placeholder}></input>;
                        break;
                
                    default:
                        markup = <item.tag type={item.type}>
                        {item.text}
                        </item.tag>;
                        break;
                }
                break;
        }
        return markup;
    }

    const handleSubmit = (e) => {
        console.log(e.target);
        e.preventDefault();
        let tempFormData;
        switch (step) {
            case 0:
                if(btnState == 'Start New Application'){
                    setStep(1);
                }else{
                    setBuildType('status');
                    setStep(0);
                }
                break;

            case 1:
                setFormData({
                    q1: {
                        values: [btnState]
                    }
                });
                setStep(2);
                break;

            case 2:
                tempFormData = formData;
                tempFormData.q2 = {
                    values: [btnState]
                }
                setFormData(tempFormData);
                (btnState == 'Yes') ? setStep(3) : setStep(4);
                break;

            case 3:
                let tempAgents = [];
                for (let index = 0; index < agents; index++) {
                    tempAgents.push(e.target.elements[`agent-${index}`].value);
                }
                tempFormData = formData;
                tempFormData.q3 = {
                    values: [tempAgents]
                }
                setFormData(tempFormData);
                setStep(4);
                break;

            case 4:
                if(btnState == 'Yes'){
                    setStep(5);
                }else{
                    tempFormData = formData;
                    tempFormData.q4 = {
                        values: [btnState]
                    }
                    setFormData(tempFormData);
                    setStep(6);
                }
                break;

            case 5:
                setFormData(undefined);
                setStep(0);
                break;

            case 6:
                if(btnState == 'No'){
                    setStep(7);
                }else{
                    tempFormData = formData;
                    tempFormData.q5 = {
                        values: [btnState]
                    }
                    setFormData(tempFormData);
                    setStep(8);
                }
                break;

            case 7:
                setFormData(undefined);
                setStep(0);
                break;

            case 8:
                tempFormData = formData;
                tempFormData.q6 = {
                    values: [btnState]
                }
                setFormData(tempFormData);
                if(btnState == 'Someone else'){
                    tempFormData.q7 = {
                        values: [null]
                    }
                    setStep(9);
                }else{
                    setStep(10);
                }
                break;

            case 9:
                tempFormData = formData;
                Array.from(e.target.elements).forEach(element => {
                    if(element.checked){
                        if(element.id == 'other'){
                            tempFormData.q7 = {
                                values: [e.target.elements['other-input'].value]
                            }
                        }else{
                            tempFormData.q7 = {
                                values: [element.value]
                            }
                        }
                    }
                });
                setFormData(tempFormData);
                setStep(10);
                break;
        
            default:
                break;
        }
    }

    const handleChange = (e) => {
        switch (e.target.id) {
            case 'other':
                setOtherInput(`${e.target.id}-input`);
                e.target.after(buildOtherInputOption(e.target));
                break;
        
            default:
                if(otherInput){
                    document.getElementById(otherInput).remove();
                    setOtherInput(undefined);
                }
                break;
        }
    }

    return (
        buildContent(props.sections)
    )
}

export default Form;

import React, { useState } from 'react';
import './Form.scss';
import Body from '../Body/Body';
import Geocoder from '../Geocoder/Geocoder';

function Form(props) {

    const {
        step        : [step, setStep],
        stepHistory : [stepHistory, setStepHistory],
        formData    : [formData, setFormData],
        buildType   : [buildType, setBuildType]
    } = {
        step        : useState(0),
        stepHistory : useState(0),
        formData    : useState(0),
        buildType   : useState(0),
        ...(props.state || {})
    };
    const [btnState, setbtnState]       = useState();
    const [agents, setAgents]           = useState(0);
    const [otherInput, setOtherInput]   = useState();

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
           <section key={section.id} className="grouping">
               {buildItems(section.items)}
               {buildAgents()}
               {(agents > 0) ? <button type="submit" onClick={(e)=>{setbtnState(e.target.innerText)}}>Done</button> : ''}
           </section>
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
        let container = document.createElement('div');
        let input = document.createElement('input');
        let label = document.createElement('label');
        container.id = `${e.getAttribute('data-special-id')}-container`;
        container.className = "other-input";
        label.innerText = e.getAttribute('data-special-label');
        container.appendChild(label);
        container.appendChild(input);
        input.type = 'text';
        input.id = e.getAttribute('data-special-id');
        input.required = true;
        input.setAttribute('placeholder', e.getAttribute('data-special-text'));
        input.setAttribute('name', e.name);
        return container;
    }

    const buildItems = (items) => {
        const markup = items.map((item) => 
            <div key={item.id}>
                {(item.labelPosition != "after") ? (item.label) ? <label htmlFor={item.id} className={getLabelClass(item.required)}>{item.labelText}</label> : '' : ''}
                {buildTag(item)}
                {(item.labelPosition == "after") ? (item.label) ? <label htmlFor={item.id} className={getLabelClass(item.required)}>{item.labelText}</label> : '' : ''}
            </div>
        );
        return markup;
    }

    const getLabelClass = (data) => {
        let tempClass = '';
        (data) ? tempClass = "required-field" : tempClass = "";
        return tempClass;
    }

    const buildTag = (item) =>{
        let markup;
        switch (item.tag) {
            case 'button':
                switch (item.type) {
                    case 'submit':
                        markup = <button role="button" aria-label={item.name} onClick={(e)=>{setbtnState(e.target.innerText)}} type={item.type}>{item.text}</button>;
                        break;
    
                    case 'add':
                        markup = <button role="button" aria-label={item.name} onClick={()=>{setAgents(agents + 1)}} type={item.type}>{item.text}</button>;
                        break;
                
                    default:
                        break;
                }
                break;

            case 'select':
                markup = <select id={item.id} name={item.name} aria-label={item.name} >{buildSelectOptions(item.id, item.selectOptions)}</select>;
                break;

            case 'textarea':
                markup = <textarea id={item.id} name={item.name} aria-label={item.name} placeholder={item.placeholder} required={item.required} aria-required={item.required}></textarea>;
                break;

            case 'GEOCODER':
                markup = 
                <Geocoder 
                id={item.id} 
                name={item.name} 
                placeholder={item.placeholder} 
                required={item.required} 
                ariaRequired={item.required}
                description={item.description}
                label={item.labelText}
                ></Geocoder>;
                break;
        
            default:
                switch (item.type) {
                    case 'radio':
                        markup = addspecialType(item);
                        break;

                    case 'checkbox':
                        markup = <input type={item.type} id={item.id} name={item.name} aria-label={item.name} value={item.value} onChange={handleChange} required={item.required} aria-required={item.required} onChange={handleGroupingRequired} data-grouping={item.grouping}></input>;
                        break;
                    
                    case 'text':
                        markup = <input type={item.type} id={item.id} name={item.name} aria-label={item.name} disabled={item.disabled} placeholder={item.placeholder} required={item.required} aria-required={item.required}></input>;
                        break;

                    case 'number':
                        markup = <input type={item.type} id={item.id} name={item.name} aria-label={item.name} disabled={item.disabled} placeholder={item.placeholder} required={item.required} aria-required={item.required}></input>;
                        break;
                
                    default:
                        markup = <item.tag type={item.type} aria-label={item.name} id={item.id}>
                        {item.text}
                        </item.tag>;
                        break;
                }
                break;
        }
        return markup;
    }

    const buildSelectOptions = (id,options) => {
        const markup = options.map((option, index) => 
            <option key={buildNewKey(id,index)} value={option.value}>{option.text}</option>
        );
        return markup;
        // Array.from(options).forEach((option, index) => {
        //     console.log(option);
        //     console.log(index);
        //     let tempKey = `${id}-option-${index}`;
        //     return <option key={tempKey} value={option.value}>{option.text}</option>
        // });
    }

    const buildNewKey = (id, index) => {
        return `${id}-${index}`;
    }

    const addspecialType = (item) => {
        if(item.hasSpecialAttribute){
            return <input type={item.type} id={item.id} name={item.name} value={item.value} onChange={handleChange} required={item.required} aria-required={item.required} data-special-type={item.specialAttribute} data-special-text={item.otherPlaceholder} data-special-label={item.otherLabel} data-special-id={item.otherID}></input>;
        }else{
            return <input type={item.type} id={item.id} name={item.name} value={item.value} onChange={handleChange} required={item.required} aria-required={item.required}></input>;
        }
    }

    const handleGroupingRequired = (e) => {
        let isChecked = false;
        if(e.target.getAttribute('data-grouping') == 'true'){
            Array.from(e.target.parentElement.parentElement.parentElement.elements).forEach(element => {
                if(element.checked){
                    isChecked = true;
                }
            });
            if(isChecked){
                Array.from(e.target.parentElement.parentElement.parentElement.elements).forEach(element => {
                    element.required = false;
                });
            }
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        let tempFormData = {};
        let tempSynthoms = [];
        let inputData    = [];
        let tempHistory  = [];
        switch (step) {
            case 0:
                switch (buildType) {
                    case "application":
                        switch (btnState) {
                            case "Start New Application":
                                tempHistory = stepHistory;
                                tempHistory.push(0);
                                setStepHistory(tempHistory);
                                setStep(1);
                                break;
        
                            case "Check Application Status":
                                setBuildType('status');
                                setStep(0);
                            break;

                            case "Finish/Edit Previous Application":
                                setBuildType('load');
                                setStep(0);
                            break;
                        
                            default:
                                break;
                        }
                        break;

                    case "status":
                        break;

                    case "load":
                        break;
                
                    default:
                        break;
                }
                break;

            case 1:
                switch (buildType) {
                    case "application":
                        tempHistory = stepHistory;
                        tempHistory.push(1);
                        setStepHistory(tempHistory);
                        setStep(2);
                        break;

                    case "status":
                        break;

                    case "load":
                        break;

                    default:
                        break;
                }
                break;

            case 2:
                switch (buildType) {
                    case "application":
                        tempFormData.represent = {
                            values: [btnState]
                        }
                        setFormData(tempFormData);
                        tempHistory = stepHistory;
                        tempHistory.push(2);
                        setStepHistory(tempHistory);
                        setStep(3);
                        break;

                    case "status":
                        break;

                    case "load":
                        break;

                    default:
                        break;
                }
                break;

            case 3:
                switch (buildType) {
                    case "application":
                        for (let index = 0; index < e.target.elements.length; index++) {
                            if(e.target.elements[index].tagName == 'INPUT' || e.target.elements[index].tagName == 'SELECT'){
                                inputData.push(e.target.elements[index].value);
                            }
                        }
                        tempFormData = formData;
                        tempFormData.contact = {
                            values: [inputData]
                        }
                        setFormData(tempFormData);
                        tempHistory = stepHistory;
                        tempHistory.push(3);
                        setStepHistory(tempHistory);
                        setStep(4);
                        break;

                    case "status":
                        break;

                    case "load":
                        break;

                    default:
                        break;
                }
                break;

            case 4:
                switch (buildType) {
                    case "application":
                        let specialType = false;
                        for (let index = 0; index < e.target.elements.length; index++) {
                            if(e.target.elements[index].tagName == 'INPUT'){
                                if(e.target.elements[index].type == 'radio'){
                                    if(e.target.elements[index].checked == true){
                                        inputData.push(e.target.elements[index].value);
                                    }
                                }else{
                                    inputData.push(e.target.elements[index].value);
                                }
                            }
                        }
                        tempFormData = formData;
                        tempFormData.applicantType = {
                            values: [inputData]
                        }
                        setFormData(tempFormData);
                        tempHistory = stepHistory;
                        tempHistory.push(4);
                        setStepHistory(tempHistory);
                        if(formData.applicantType.values[0].length > 1){
                            setStep(5);
                        }else{
                            if(formData.represent.values[0] == "Myself"){
                                tempFormData = formData;
                                tempFormData.contactIndividual = {
                                    values: formData.contact.values
                                }
                                setFormData(tempFormData);
                                setStep(7);
                            }else{
                                setStep(6);
                            }
                        }
                        break;

                    case "status":
                        break;

                    case "load":
                        break;

                    default:
                        break;
                }
                break;

            case 5:
                for (let index = 0; index < e.target.elements.length; index++) {
                    if(e.target.elements[index].tagName == 'INPUT'){
                        inputData.push(e.target.elements[index].value);
                    }
                }
                tempFormData = formData;
                tempFormData.contactBusiness = {
                    values: [inputData]
                }
                setFormData(tempFormData);
                tempHistory = stepHistory;
                tempHistory.push(5);
                setStepHistory(tempHistory);
                setStep(7);
                break;

            case 6:
                for (let index = 0; index < e.target.elements.length; index++) {
                    if(e.target.elements[index].tagName == 'INPUT'){
                        inputData.push(e.target.elements[index].value);
                    }
                }
                tempFormData = formData;
                tempFormData.contactIndividual = {
                    values: [inputData]
                }
                setFormData(tempFormData);
                tempHistory = stepHistory;
                tempHistory.push(6);
                setStepHistory(tempHistory);
                setStep(7);
                break;

            case 7:
                tempFormData = formData;
                tempFormData.inDetroit = {
                    values: [btnState]
                }
                setFormData(tempFormData);
                tempHistory = stepHistory;
                tempHistory.push(7);
                setStepHistory(tempHistory);
                setStep(8);
                break;

            case 8:
                tempFormData = formData;
                tempFormData.DLBACommunityPartner = {
                    values: [btnState]
                }
                setFormData(tempFormData);
                tempHistory = stepHistory;
                tempHistory.push(8);
                setStepHistory(tempHistory);
                if(btnState == "Yes"){
                    setStep(9);
                }else{
                    setStep(10);
                }
                break;

            case 9:
                for (let index = 0; index < e.target.elements.length; index++) {
                    if(e.target.elements[index].tagName == 'TEXTAREA'){
                        inputData.push(e.target.elements[index].value);
                    }
                }
                tempFormData = formData;
                tempFormData.partnerList = {
                    values: [inputData]
                }
                setFormData(tempFormData);
                tempHistory = stepHistory;
                tempHistory.push(9);
                setStepHistory(tempHistory);
                setStep(10);
                break;

            case 10:
                tempFormData = formData;
                tempFormData.ownDetroitProperty = {
                    values: [btnState]
                }
                setFormData(tempFormData);
                tempHistory = stepHistory;
                tempHistory.push(10);
                setStepHistory(tempHistory);
                if(btnState == "Yes"){
                    setStep(11);
                }else{
                    setStep(12);
                }
                break;

            case 11:
                if(btnState == 'None of the above'){
                    setStep(14);
                }else{
                    setStep(13);
                }
                break;

            case 12:
                if(btnState == 'None of the above'){
                    setStep(14);
                }else{
                    setStep(13);
                }
                break;

            case 13:
                break;

            case 14:
                if(btnState == 'Yes'){
                    setStep(15);
                }else{
                    setStep(28); 
                }
                break;

            case 15:
                tempSynthoms = [];
                Array.from(e.target.elements).forEach(element => {
                    if(element.checked){
                        tempSynthoms.push(element.id);
                    }
                });
                if(tempSynthoms.length > 1){
                    setStep(16);
                }else{
                    (tempSynthoms[0] == 'other') ? setStep(20) : setStep(16);
                }
                break;

            case 16:
                if(btnState == 'Yes'){
                    setStep(17);
                }else{
                    if(formData.age.values[0] >= 19){
                        setStep(18);
                    }else{
                        setStep(20);
                    }
                }
                break;

            case 17:
                break;

            case 18:
                if(btnState == 'Yes'){
                    setStep(19);
                }else{
                    setStep(20);
                }
                break;

            case 19:
                break;

            case 20:
                tempSynthoms = [];
                Array.from(e.target.elements).forEach(element => {
                    if(element.checked){
                        tempSynthoms.push(element.id);
                    }
                });
                if(tempSynthoms.length > 1){
                    setStep(21);
                }else{
                    (tempSynthoms[0] == 'other') ? setStep(22) : setStep(21);
                }
                break; 

            case 21:
                break;

            case 22:
                break;

            case 23:
                setStep(24);
                break;

            case 24:
                if(btnState == 'Yes'){
                    setStep(17);
                }else{
                    if(formData.age.values[0] >= 19){
                        setStep(25);
                    }else{
                        setStep(27);
                    }
                }
                break;

            case 25:
                if(btnState == 'Yes'){
                    setStep(26);
                }else{
                    setStep(27);
                }
                break;

            case 26:
                break;

            case 27:
                setStep(26);
                break;

            case 28:
                tempSynthoms = [];
                let covidCout = 0;
                Array.from(e.target.elements).forEach(element => {
                    if(element.checked){
                        tempSynthoms.push(element.id);
                    }
                });
                if(tempSynthoms.length > 1){
                    tempSynthoms.forEach((syn) => {
                        (syn == 'other') ? 0 : covidCout++;
                    });
                    if(covidCout > 1){
                        setStep(34);
                    }else{
                        setStep(30);
                    }
                }else{
                    (tempSynthoms[0] == 'other') ? setStep(29) : setStep(30);
                }
                break;

            case 29:
                setStep(26);
                break;

            case 30:
                if(btnState == 'Yes'){
                    setStep(17);
                }else{
                    if(formData.age.values[0] >= 19){
                        setStep(31);
                    }else{
                        setStep(32);
                    }
                }
                break;

            case 31:
                if(btnState == 'Yes'){
                    setStep(33);
                }else{
                    setStep(32);
                }
                break;

            case 32:
                setStep(22);
                break;

            case 33:
                break;

            case 34:
                if(btnState == 'Yes'){
                    setStep(17);
                }else{
                    if(formData.age.values[0] >= 65){
                        setStep(38);
                    }else{
                        setStep(35);
                    }
                }
                break;

            case 35:
                tempSynthoms = [];
                Array.from(e.target.elements).forEach(element => {
                    if(element.checked){
                        tempSynthoms.push(element.id);
                    }
                });
                if(tempSynthoms.length > 1){
                    if(formData.age.values[0] >= 19){
                        setStep(36);
                    }else{
                        setStep(21);
                    }
                }else{
                    if(formData.age.values[0] >= 19){
                        setStep(36);
                    }else{
                        setStep(22);
                    }
                }
                break;

            case 36:
                if(btnState == 'Yes'){
                    setStep(37);
                }else{
                    setStep(22);
                }
                break;

            case 37:
                break;

            case 38:
                tempSynthoms = [];
                Array.from(e.target.elements).forEach(element => {
                    if(element.checked){
                        tempSynthoms.push(element.id);
                    }
                });
                if(tempSynthoms.length > 1){
                    setStep(40);
                }else{
                    (tempSynthoms[0] == 'other') ? setStep(39) : setStep(40);
                }
                break;

            case 39:
                if(btnState == 'Yes'){
                    setStep(19);
                }else{
                    setStep(42);
                }
                break;

            case 40:
                if(btnState == 'Yes'){
                    setStep(41);
                }else{
                    setStep(21);
                }
                break;
        
            default:
                break;
        }
    }

    const handleChange = (e) => {
        switch (e.target.getAttribute('data-special-type')) {
            case 'other':
                setOtherInput(`${e.target.getAttribute('data-special-id')}-container`);
                console.log(e.target);
                e.target.parentElement.after(buildOtherInputOption(e.target));
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
        buildContent()
    )
}

export default Form;

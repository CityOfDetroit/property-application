import React, { useState, useEffect } from 'react';
import './Form.scss';
import Body from '../Body/Body';
import Geocoder from '../Geocoder/Geocoder';
import Connector from '../Connector/Connector';

function Form(props) {

    const {
        appID       : [appID, setAppID],
        step        : [step, setStep],
        stepHistory : [stepHistory, setStepHistory],
        formData    : [formData, setFormData],
        buildType   : [buildType, setBuildType]
    } = {
        appID       : useState(),
        step        : useState(),
        stepHistory : useState(),
        formData    : useState(),
        buildType   : useState(),
        ...(props.state || {})
    };
    const [error, setError]             = useState();
    const [btnState, setbtnState]       = useState();
    const [extras, setExtras]           = useState();
    const [extrasCount, setExtrasCount] = useState(0);
    const [otherInput, setOtherInput]   = useState();

    // ================== Builder Section ====================
    const buildContent = () => {
        const formClass = `${props.type} ${props.position}`; 
        const markup = 
        <form id={props.id} className={formClass} onSubmit={handleSubmit}>
            <Body type={props.text.type} content={props.text.markup}></Body>
            {buildSections()}
        </form>
        return markup;
    }

    const buildSections = () => {
        const markup = props.sections.map((section) =>
           <section key={section.id} className="grouping">
               {buildExtras()}
               {buildItems(section.items)}
           </section>
        );
        return markup;
    }

    const buildExtras = () => {
        let extrasArr = [];
        let markup = "";
        for (let index = 0; index < extrasCount; index++) {
            extrasArr.push(`${extras.getAttribute('data-special-id')}-${index + 1}`);
        }
        if(extrasCount > 0){
            switch (extras.getAttribute('data-special-type')) {
                case "geocoder":
                    markup = extrasArr.map((extra) =>
                    <Geocoder 
                    key={extra}
                    id={extra} 
                    name={extra} 
                    placeholder={extras.getAttribute('data-special-text')} 
                    required={true}
                    ariaRequired={true}
                    label={extras.getAttribute('data-special-label')} 
                    ></Geocoder>
                    );
                    break;

                case "text":
                    markup = extrasArr.map((extra) =>
                    <div>
                        <label htmlFor={extra} className={getLabelClass(true)}>{extras.getAttribute('data-special-label')}</label>
                        <input key={extra} type={extras.getAttribute('data-special-type')} id={extra} name={extra} aria-label={extra} placeholder={extras.getAttribute('data-special-text')} required={true} aria-required={true}></input>
                    </div>
                    );
                    break;

                case "file":
                    markup = extrasArr.map((extra) =>
                    <div>
                        <label htmlFor={extra} className={getLabelClass(true)}>{extras.getAttribute('data-special-label')}</label>
                        <input key={extra} type={extras.getAttribute('data-special-type')} id={extra} name={extra} aria-label={extra} required={true} aria-required={true}></input>
                    </div>
                    );
                    break;
            
                default:
                    break;
            }
        }
       
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
        const markup = items.map((item, index) => 
            <div key={item.id}>
                {(item.labelPosition != "after") ? (item.label) ? <label htmlFor={item.id} className={getLabelClass(item.required)}>{item.labelText}</label> : '' : ''}
                {buildTag(item, index)}
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

    const buildTag = (item, index) =>{
        let markup;
        switch (item.tag) {
            case 'button':
                switch (item.type) {
                    case 'submit':
                        if(props.savedData){
                            if(formData == undefined){
                                markup = <button role="button" aria-label={item.name} onClick={(e)=>{setbtnState(e.target.innerText)}} type={item.type}>{item.text}</button>;
                            }else{
                                if(formData[props.id] == undefined){
                                    markup = <button role="button" aria-label={item.name} onClick={(e)=>{setbtnState(e.target.innerText)}} type={item.type}>{item.text}</button>;
                                }else{
                                    if(formData[props.id][index] == item.text){
                                        markup = <button className="selected" role="button" aria-label={item.name} onClick={(e)=>{setbtnState(e.target.innerText)}} type={item.type}>{item.text}</button>;
                                    }else{
                                        markup = <button role="button" aria-label={item.name} onClick={(e)=>{setbtnState(e.target.innerText)}} type={item.type}>{item.text}</button>;
                                    }
                                }
                            }
                        }else{
                            markup = <button role="button" aria-label={item.name} onClick={(e)=>{setbtnState(e.target.innerText)}} type={item.type}>{item.text}</button>;
                        }
                        break;
    
                    case 'button':
                        switch (item.text) {
                            case 'Add':
                                markup = <button role="button" aria-label={item.name} onClick={(e)=>{setExtrasCount(extrasCount + 1); setExtras(e.target)}} type={item.type} data-special-type={item.specialAttribute} data-special-text={item.otherPlaceholder} data-special-label={item.otherLabel} data-special-id={item.otherID}>{item.text}</button>;
                                break;

                            case 'Remove':
                                markup = <button 
                            role="button" 
                            aria-label={item.name} 
                            onClick={(e)=>{
                                if(extrasCount > 0){setExtrasCount(extrasCount - 1);setExtras(e.target);} 
                            }} 
                            type={item.type} data-special-type={item.specialAttribute} data-special-text={item.otherPlaceholder} data-special-label={item.otherLabel} data-special-id={item.otherID}>{item.text}</button>;
                                break;
                        
                            default:
                                break;
                        }
                        break;
                
                    default:
                        break;
                }
                break;

            case 'select':
                if(props.savedData){
                    if(formData == undefined){
                        markup = <select id={item.id} name={item.name} aria-label={item.name} >{buildSelectOptions(item.id, item.selectOptions)}</select>;
                    }else{
                        if(formData[props.id] == undefined){
                            markup = <select id={item.id} name={item.name} aria-label={item.name} >{buildSelectOptions(item.id, item.selectOptions)}</select>;
                        }else{
                            markup = <select id={item.id} name={item.name} aria-label={item.name} vallue={formData[props.id][index]}>{buildSelectOptions(item.id, item.selectOptions)}</select>;
                        }
                    }
                }else{
                    markup = <select id={item.id} name={item.name} aria-label={item.name} >{buildSelectOptions(item.id, item.selectOptions)}</select>;
                }
                break;

            case 'textarea':
                if(props.savedData){
                    if(formData == undefined){
                        markup = <textarea id={item.id} name={item.name} aria-label={item.name} placeholder={item.placeholder} required={item.required} aria-required={item.required}></textarea>;
                    }else{
                        if(formData[props.id] == undefined){
                            markup = <textarea id={item.id} name={item.name} aria-label={item.name} placeholder={item.placeholder} required={item.required} aria-required={item.required}></textarea>;
                        }else{
                            markup = <textarea id={item.id} name={item.name} value={formData[props.id][index]} aria-label={item.name} placeholder={item.placeholder} required={item.required} aria-required={item.required}></textarea>;
                        }
                    }
                }else{
                    markup = <textarea id={item.id} name={item.name} aria-label={item.name} placeholder={item.placeholder} required={item.required} aria-required={item.required}></textarea>;
                }
                break;

            case 'GEOCODER':
                if(props.savedData){
                    if(formData == undefined){
                        markup = 
                        <Geocoder 
                        id={item.id} 
                        name={item.name} 
                        placeholder={item.placeholder} 
                        required={item.required} 
                        ariaRequired={item.required}
                        label={item.labelText}
                        value={item.value}
                        ></Geocoder>;
                    }else{
                        if(formData[props.id] == undefined){
                            markup = 
                            <Geocoder 
                            id={item.id} 
                            name={item.name} 
                            placeholder={item.placeholder} 
                            required={item.required} 
                            ariaRequired={item.required}
                            label={item.labelText}
                            value={item.value}
                            ></Geocoder>;
                        }else{
                            markup = 
                            <Geocoder 
                            id={item.id} 
                            name={item.name} 
                            placeholder={item.placeholder} 
                            required={item.required} 
                            ariaRequired={item.required}
                            label={item.labelText}
                            value={formData[props.id][index]}
                            ></Geocoder>;
                        }
                    }
                }else{
                    markup = 
                    <Geocoder 
                    id={item.id} 
                    name={item.name} 
                    placeholder={item.placeholder} 
                    required={item.required} 
                    ariaRequired={item.required}
                    label={item.labelText}
                    value={item.value}
                    ></Geocoder>;
                }
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
                        if(props.savedData){
                            if(formData == undefined){
                                markup = <input type={item.type} id={item.id} name={item.name} aria-label={item.name} disabled={item.disabled} placeholder={item.placeholder} required={item.required} aria-required={item.required}></input>;
                            }else{
                                if(formData[props.id] == undefined){
                                    markup = <input type={item.type} id={item.id} name={item.name} aria-label={item.name} disabled={item.disabled} placeholder={item.placeholder} required={item.required} aria-required={item.required}></input>;
                                }else{
                                    markup = <input type={item.type} id={item.id} name={item.name} value={formData[props.id][index]} aria-label={item.name} disabled={item.disabled} placeholder={item.placeholder} required={item.required} aria-required={item.required}></input>;
                                }
                            }
                        }else{
                            markup = <input type={item.type} id={item.id} name={item.name} aria-label={item.name} disabled={item.disabled} placeholder={item.placeholder} required={item.required} aria-required={item.required}></input>;
                        }
                        break;

                    case 'file':
                        markup = <input type={item.type} id={item.id} name={item.name} aria-label={item.name} disabled={item.disabled} required={item.required} aria-required={item.required}></input>;
                        break;

                    case 'number':
                        markup = <input type={item.type} id={item.id} name={item.name} aria-label={item.name} disabled={item.disabled} placeholder={item.placeholder} required={item.required} aria-required={item.required}></input>;
                        break;

                    case 'date':
                        markup = <input type={item.type} id={item.id} name={item.name} aria-label={item.name} disabled={item.disabled} required={item.required} aria-required={item.required}></input>;
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

    // ================== Handler  Section ====================
    const handleAPICalls = (e, callType, currentStep, nextStep) => {
        let tempHistory;
        if(e.status >= 200 && e.status < 300){
            switch (callType) {
                case 'getID':
                    e.json().then(data => {
                        setAppID(data.id);
                    });
                    tempHistory = stepHistory;
                    tempHistory.push(currentStep);
                    setStepHistory(tempHistory);
                    setStep(nextStep);
                    break;

                case 'saveForm':
                    switch (currentStep) {
                        case 33:
                            Connector.start('post',`https://apis.detroitmi.gov/property_applications/${appID}/finish/`,null,true,props.token,'application/json',(e)=>{handleAPICalls(e, 'finish', currentStep, nextStep)},(e)=>{handleAPICalls(e, 'finish', currentStep)});
                            break;
                    
                        default:
                            tempHistory = stepHistory;
                            tempHistory.push(currentStep);
                            setStepHistory(tempHistory);
                            setStep(nextStep);
                            break;
                    }
                    break;

                case 'getStatus':
                    e.json().then(data => {
                        switch (data.status) {
                            case 'incomplete':
                                tempHistory = stepHistory;
                                tempHistory.push(currentStep);
                                setStepHistory(tempHistory);
                                setStep(1);
                                break;

                            case 'complete':
                                tempHistory = stepHistory;
                                tempHistory.push(currentStep);
                                setStepHistory(tempHistory);
                                setStep(2);
                                break;
                        
                            default:
                                break;
                        }
                    });
                    break;

                case 'loadApplication':
                    e.json().then(data => {
                        setAppID(data.id);
                        setFormData(data.answers);
                        tempHistory = stepHistory;
                        tempHistory.push(currentStep);
                        setStepHistory(tempHistory);
                        setStep(1);
                    });
                    break;

                default:
                    tempHistory = stepHistory;
                    tempHistory.push(currentStep);
                    setStepHistory(tempHistory);
                    setStep(nextStep);
                    break;
            }
        }else{

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

    const handleChange = (e) => {
        switch (e.target.getAttribute('data-special-type')) {
            case 'other':
                setOtherInput(`${e.target.getAttribute('data-special-id')}-container`);
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

    const handleSubmit = (e) => {
        e.preventDefault();
        let specialType  = false;
        let attachments  = 0;
        let tempFormData = {};
        let tempSynthoms = [];
        let inputData    = [];
        let tempHistory  = [];
        let postData     = {answers:null};
        let nextStep;
        switch (step) {
            case 0:
                switch (buildType) {
                    case "application":
                        switch (btnState) {
                            case "Start New Application": 
                                tempHistory = stepHistory;
                                tempHistory.push(step);
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
                        for (let index = 0; index < e.target.elements.length; index++) {
                            if(e.target.elements[index].tagName == 'INPUT'){
                                inputData.push(e.target.elements[index].value);
                            }
                        }
                        Connector.start('get',`https://apis.detroitmi.gov/property_applications/${inputData[0]}/status/`,null,false,null,'application/json',(e)=>{handleAPICalls(e, 'getStatus', step)},(e)=>{handleAPICalls(e, 'getStatus', step)});
                        break;

                    case "load":
                        for (let index = 0; index < e.target.elements.length; index++) {
                            if(e.target.elements[index].tagName == 'INPUT'){
                                inputData.push(e.target.elements[index].value);
                            }
                        }
                        Connector.start('get',`https://apis.detroitmi.gov/property_applications/${inputData[0]}/answers/`,null,false,null,'application/json',(e)=>{handleAPICalls(e, 'loadApplication', step)},(e)=>{handleAPICalls(e, 'getStatus', step)});
                        break;
                
                    default:
                        break;
                }
                break;

            case 1:
                switch (buildType) {
                    case "application":
                        if(appID == undefined){
                            Connector.start('post','https://apis.detroitmi.gov/property_applications/start/',null,true,props.token,'application/json',(e)=>{handleAPICalls(e, 'getID', step, 2)},(e)=>{handleAPICalls(e, 'getID', step)});
                        }else{
                            tempHistory = stepHistory;
                            tempHistory.push(step);
                            setStepHistory(tempHistory);
                            setStep(3);
                        }
                        break;

                    case "status":
                        break;

                    case "load":
                        tempHistory = [0,1];
                        setBuildType('application');
                        setStepHistory(tempHistory);
                        setStep(2);
                        break;

                    default:
                        break;
                }
                break;

            case 2:
                switch (buildType) {
                    case "application":
                        if(formData != undefined){
                            tempFormData = formData;
                        }
                        tempFormData[e.target.id] = {
                            values: btnState
                        }
                        setFormData(tempFormData);
                        postData.answers = tempFormData;
                        Connector.start('post',`https://apis.detroitmi.gov/property_applications/${appID}/answers/`,postData,true,props.token,'application/json',(e)=>{handleAPICalls(e, 'saveForm', step, 3)},(e)=>{handleAPICalls(e, 'saveForm', step)});
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
                        tempFormData[e.target.id] = {
                            values: inputData
                        }
                        setFormData(tempFormData);
                        postData.answers = tempFormData;
                        Connector.start('post',`https://apis.detroitmi.gov/property_applications/${appID}/answers/`,postData,true,props.token,'application/json',(e)=>{handleAPICalls(e, 'saveForm', step, 4)},(e)=>{handleAPICalls(e, 'saveForm', step)});
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
                        specialType = false;
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
                        tempFormData[e.target.id] = {
                            values: inputData
                        }
                        if(formData.applicantType.values.length > 1){
                            nextStep = 5;
                        }else{
                            if(formData.represent.values[0] == "Myself"){
                                tempFormData = formData;
                                tempFormData.contactIndividual = {
                                    values: formData.contact.values
                                }
                                setFormData(tempFormData);
                                nextStep = 7;
                            }else{
                                nextStep = 6;
                                setStep(6);
                            }
                        }
                        setFormData(tempFormData);
                        postData.answers = tempFormData;
                        Connector.start('post',`https://apis.detroitmi.gov/property_applications/${appID}/answers/`,postData,true,props.token,'application/json',(e)=>{handleAPICalls(e, 'saveForm', step, nextStep)},(e)=>{handleAPICalls(e, 'saveForm', step)});
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
                tempFormData[e.target.id] = {
                    values: inputData
                }
                setFormData(tempFormData);
                nextStep = 7;
                postData.answers = tempFormData;
                Connector.start('post',`https://apis.detroitmi.gov/property_applications/${appID}/answers/`,postData,true,props.token,'application/json',(e)=>{handleAPICalls(e, 'saveForm', step, nextStep)},(e)=>{handleAPICalls(e, 'saveForm', step)});
                break;

            case 6:
                for (let index = 0; index < e.target.elements.length; index++) {
                    if(e.target.elements[index].tagName == 'INPUT'){
                        inputData.push(e.target.elements[index].value);
                    }
                }
                tempFormData = formData;
                tempFormData[e.target.id] = {
                    values: inputData
                }
                nextStep = 7;
                postData.answers = tempFormData;
                Connector.start('post',`https://apis.detroitmi.gov/property_applications/${appID}/answers/`,postData,true,props.token,'application/json',(e)=>{handleAPICalls(e, 'saveForm', step, nextStep)},(e)=>{handleAPICalls(e, 'saveForm', step)});
                break;

            case 7:
                tempFormData = formData;
                tempFormData[e.target.id] = {
                    values: btnState
                }
                setFormData(tempFormData);
                nextStep = 8;
                postData.answers = tempFormData;
                Connector.start('post',`https://apis.detroitmi.gov/property_applications/${appID}/answers/`,postData,true,props.token,'application/json',(e)=>{handleAPICalls(e, 'saveForm', step, nextStep)},(e)=>{handleAPICalls(e, 'saveForm', step)});
                break;

            case 8:
                tempFormData = formData;
                tempFormData[e.target.id] = {
                    values: btnState
                }
                setFormData(tempFormData);
                if(btnState == "Yes"){
                    nextStep = 9;
                }else{
                    nextStep = 10;
                }
                postData.answers = tempFormData;
                Connector.start('post',`https://apis.detroitmi.gov/property_applications/${appID}/answers/`,postData,true,props.token,'application/json',(e)=>{handleAPICalls(e, 'saveForm', step, nextStep)},(e)=>{handleAPICalls(e, 'saveForm', step)});
                break;

            case 9:
                for (let index = 0; index < e.target.elements.length; index++) {
                    if(e.target.elements[index].tagName == 'TEXTAREA'){
                        inputData.push(e.target.elements[index].value);
                    }
                }
                tempFormData = formData;
                tempFormData[e.target.id] = {
                    values: inputData
                }
                setFormData(tempFormData);
                nextStep = 10;
                postData.answers = tempFormData;
                Connector.start('post',`https://apis.detroitmi.gov/property_applications/${appID}/answers/`,postData,true,props.token,'application/json',(e)=>{handleAPICalls(e, 'saveForm', step, nextStep)},(e)=>{handleAPICalls(e, 'saveForm', step)});
                break;

            case 10:
                tempFormData = formData;
                tempFormData[e.target.id] = {
                    values: btnState
                }
                setFormData(tempFormData);
                if(btnState == "Yes"){
                    nextStep = 11;
                }else{
                    nextStep = 12;
                }
                postData.answers = tempFormData;
                Connector.start('post',`https://apis.detroitmi.gov/property_applications/${appID}/answers/`,postData,true,props.token,'application/json',(e)=>{handleAPICalls(e, 'saveForm', step, nextStep)},(e)=>{handleAPICalls(e, 'saveForm', step)});
                break;

            case 11:
                for (let index = 0; index < e.target.elements.length; index++) {
                    if(e.target.elements[index].tagName == 'INPUT'){
                        inputData.push(e.target.elements[index].value);
                        (e.target.elements[index].getAttribute('data-parcel') == null) ? inputData.push('') : inputData.push(e.target.elements[index].getAttribute('data-parcel'));
                    }
                }
                tempFormData = formData;
                tempFormData[e.target.id] = {
                    values: inputData
                }
                setFormData(tempFormData);
                setStepHistory(tempHistory);
                setExtrasCount(0);
                setExtras(undefined);
                nextStep = 12;
                postData.answers = tempFormData;
                Connector.start('post',`https://apis.detroitmi.gov/property_applications/${appID}/answers/`,postData,true,props.token,'application/json',(e)=>{handleAPICalls(e, 'saveForm', step, nextStep)},(e)=>{handleAPICalls(e, 'saveForm', step)});
                break;

            case 12:
                tempFormData = formData;
                tempFormData[e.target.id] = {
                    values: btnState
                }
                setFormData(tempFormData);
                if(btnState == "Yes"){
                    nextStep = 13
                }else{
                    nextStep = 14;
                }
                postData.answers = tempFormData;
                Connector.start('post',`https://apis.detroitmi.gov/property_applications/${appID}/answers/`,postData,true,props.token,'application/json',(e)=>{handleAPICalls(e, 'saveForm', step, nextStep)},(e)=>{handleAPICalls(e, 'saveForm', step)});
                break;

            case 13:
                for (let index = 0; index < e.target.elements.length; index++) {
                    if(e.target.elements[index].tagName == 'INPUT'){
                        inputData.push(e.target.elements[index].value);
                    }
                }
                tempFormData = formData;
                tempFormData[e.target.id] = {
                    values: inputData
                }
                setFormData(tempFormData);
                nextStep = 14;
                postData.answers = tempFormData;
                Connector.start('post',`https://apis.detroitmi.gov/property_applications/${appID}/answers/`,postData,true,props.token,'application/json',(e)=>{handleAPICalls(e, 'saveForm', step, nextStep)},(e)=>{handleAPICalls(e, 'saveForm', step)});
                break;

            case 14:
                tempFormData = formData;
                tempFormData[e.target.id] = {
                    values: btnState
                }
                setFormData(tempFormData);
                if(btnState == "Yes"){
                    nextStep = 15
                }else{
                    nextStep = 16;
                }
                postData.answers = tempFormData;
                Connector.start('post',`https://apis.detroitmi.gov/property_applications/${appID}/answers/`,postData,true,props.token,'application/json',(e)=>{handleAPICalls(e, 'saveForm', step, nextStep)},(e)=>{handleAPICalls(e, 'saveForm', step)});
                break;

            case 15:
                break;

            case 16:
                // tempSynthoms = [];
                // Array.from(e.target.elements).forEach(element => {
                //     if(element.checked){
                //         tempSynthoms.push(element.id);
                //     }
                // });
                // if(tempSynthoms.length > 1){
                //     setStep(16);
                // }else{
                //     (tempSynthoms[0] == 'other') ? setStep(20) : setStep(16);
                // }
                tempFormData = formData;
                tempFormData[e.target.id] = {
                    values: btnState
                }
                setFormData(tempFormData);
                if(btnState == "Yes"){
                    nextStep = 18;
                }else{
                    nextStep = 17;
                }
                postData.answers = tempFormData;
                Connector.start('post',`https://apis.detroitmi.gov/property_applications/${appID}/answers/`,postData,true,props.token,'application/json',(e)=>{handleAPICalls(e, 'saveForm', step, nextStep)},(e)=>{handleAPICalls(e, 'saveForm', step)});
                break;

            case 17:
                break;

            case 18:
                for (let index = 0; index < e.target.elements.length; index++) {
                    if(e.target.elements[index].tagName == 'INPUT'){
                        inputData.push(e.target.elements[index].value);
                        (e.target.elements[index].getAttribute('data-parcel') == null) ? inputData.push('') : inputData.push(e.target.elements[index].getAttribute('data-parcel'));
                    }
                }
                tempFormData = formData;
                tempFormData[e.target.id] = {
                    values: inputData
                }
                setFormData(tempFormData);
                setExtrasCount(0);
                setExtras(undefined);
                nextStep = 19;
                postData.answers = tempFormData;
                Connector.start('post',`https://apis.detroitmi.gov/property_applications/${appID}/answers/`,postData,true,props.token,'application/json',(e)=>{handleAPICalls(e, 'saveForm', step, nextStep)},(e)=>{handleAPICalls(e, 'saveForm', step)});
                break;

            case 19:
                tempFormData = formData;
                tempFormData[e.target.id] = {
                    values: btnState
                }
                setFormData(tempFormData);
                if(btnState == "Yes"){
                    nextStep = 20;
                }else{
                    nextStep = 21;
                }
                postData.answers = tempFormData;
                Connector.start('post',`https://apis.detroitmi.gov/property_applications/${appID}/answers/`,postData,true,props.token,'application/json',(e)=>{handleAPICalls(e, 'saveForm', step, nextStep)},(e)=>{handleAPICalls(e, 'saveForm', step)});
                break;

            case 20:
                for (let index = 0; index < e.target.elements.length; index++) {
                    if(e.target.elements[index].tagName == 'INPUT'){
                        inputData.push(e.target.elements[index].value);
                        (e.target.elements[index].getAttribute('data-parcel') == null) ? inputData.push('') : inputData.push(e.target.elements[index].getAttribute('data-parcel'));
                    }
                }
                tempFormData = formData;
                tempFormData[e.target.id] = {
                    values: inputData
                }
                setFormData(tempFormData);
                setExtrasCount(0);
                setExtras(undefined);
                nextStep = 21;
                postData.answers = tempFormData;
                Connector.start('post',`https://apis.detroitmi.gov/property_applications/${appID}/answers/`,postData,true,props.token,'application/json',(e)=>{handleAPICalls(e, 'saveForm', step, nextStep)},(e)=>{handleAPICalls(e, 'saveForm', step)});
                break;

            case 21:
                // tempSynthoms = [];
                // Array.from(e.target.elements).forEach(element => {
                //     if(element.checked){
                //         tempSynthoms.push(element.id);
                //     }
                // });
                // if(tempSynthoms.length > 1){
                //     setStep(21);
                // }else{
                //     (tempSynthoms[0] == 'other') ? setStep(22) : setStep(21);
                // }
                tempFormData = formData;
                tempFormData[e.target.id] = {
                    values: btnState
                }
                setFormData(tempFormData);
                nextStep = 22;
                postData.answers = tempFormData;
                Connector.start('post',`https://apis.detroitmi.gov/property_applications/${appID}/answers/`,postData,true,props.token,'application/json',(e)=>{handleAPICalls(e, 'saveForm', step, nextStep)},(e)=>{handleAPICalls(e, 'saveForm', step)});
                break; 

            case 22:
                tempFormData = formData;
                tempFormData[e.target.id] = {
                    values: btnState
                }
                setFormData(tempFormData);
                if(btnState == "Purchase"){
                    nextStep = 23;
                }else{
                    //come back
                    nextStep = 21;
                }
                postData.answers = tempFormData;
                Connector.start('post',`https://apis.detroitmi.gov/property_applications/${appID}/answers/`,postData,true,props.token,'application/json',(e)=>{handleAPICalls(e, 'saveForm', step, nextStep)},(e)=>{handleAPICalls(e, 'saveForm', step)});
                break;

            case 23:
                for (let index = 0; index < e.target.elements.length; index++) {
                    if(e.target.elements[index].tagName == 'INPUT'){
                        inputData.push(e.target.elements[index].value);
                    }
                }
                tempFormData = formData;
                tempFormData[e.target.id] = {
                    values: inputData
                }
                setFormData(tempFormData);
                nextStep = 24;
                postData.answers = tempFormData;
                Connector.start('post',`https://apis.detroitmi.gov/property_applications/${appID}/answers/`,postData,true,props.token,'application/json',(e)=>{handleAPICalls(e, 'saveForm', step, nextStep)},(e)=>{handleAPICalls(e, 'saveForm', step)});
                break;

            case 24:
                specialType = false;
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
                tempFormData[e.target.id] = {
                    values: inputData
                }
                setFormData(tempFormData);
                if(formData.propertyUse.values.length > 1){
                    // come back
                    nextStep = 5;
                }else{
                    switch (formData.propertyUse.values[0]) {
                        case "commercial-retail":
                            nextStep = 29;
                            break;

                        case "mixed-use":
                            nextStep = 29;
                            break;

                        case "residential-multifamily":
                            nextStep = 29;
                            break;

                        case "residential-single-family":
                            nextStep = 29;
                            break;

                        case "industrial":
                            nextStep = 29;
                            break;

                        case "parking-lot-auto-related":
                            nextStep = 25;
                            break;
                    
                        default:
                            break;
                    }
                }
                postData.answers = tempFormData;
                Connector.start('post',`https://apis.detroitmi.gov/property_applications/${appID}/answers/`,postData,true,props.token,'application/json',(e)=>{handleAPICalls(e, 'saveForm', step, nextStep)},(e)=>{handleAPICalls(e, 'saveForm', step)});
                break;

            case 25:
                tempFormData = formData;
                tempFormData[e.target.id] = {
                    values: btnState
                }
                setFormData(tempFormData);
                if(btnState == 'Parking Lot'){
                    nextStep = 26;
                }else{
                    nextStep = 29;
                }
                postData.answers = tempFormData;
                Connector.start('post',`https://apis.detroitmi.gov/property_applications/${appID}/answers/`,postData,true,props.token,'application/json',(e)=>{handleAPICalls(e, 'saveForm', step, nextStep)},(e)=>{handleAPICalls(e, 'saveForm', step)});
                break;

            case 26:
                for (let index = 0; index < e.target.elements.length; index++) {
                    if(e.target.elements[index].tagName == 'INPUT'){
                        inputData.push(e.target.elements[index].value);
                    }
                }
                tempFormData = formData;
                tempFormData[e.target.id] = {
                    values: inputData
                }
                setFormData(tempFormData);
                nextStep = 27;
                postData.answers = tempFormData;
                Connector.start('post',`https://apis.detroitmi.gov/property_applications/${appID}/answers/`,postData,true,props.token,'application/json',(e)=>{handleAPICalls(e, 'saveForm', step, nextStep)},(e)=>{handleAPICalls(e, 'saveForm', step)});
                break;

            case 27:
                for (let index = 0; index < e.target.elements.length; index++) {
                    if(e.target.elements[index].tagName == 'INPUT'){
                        inputData.push(e.target.elements[index].value);
                    }
                }
                tempFormData = formData;
                tempFormData[e.target.id] = {
                    values: inputData
                }
                setFormData(tempFormData);
                nextStep = 28;
                postData.answers = tempFormData;
                Connector.start('post',`https://apis.detroitmi.gov/property_applications/${appID}/answers/`,postData,true,props.token,'application/json',(e)=>{handleAPICalls(e, 'saveForm', step, nextStep)},(e)=>{handleAPICalls(e, 'saveForm', step)});
                break;

            case 28:
                tempFormData = formData;
                tempFormData[e.target.id] = {
                    values: btnState
                }
                setFormData(tempFormData);
                nextStep = 29;
                postData.answers = tempFormData;
                Connector.start('post',`https://apis.detroitmi.gov/property_applications/${appID}/answers/`,postData,true,props.token,'application/json',(e)=>{handleAPICalls(e, 'saveForm', step, nextStep)},(e)=>{handleAPICalls(e, 'saveForm', step)});
                break;

            case 29:
                specialType = false;
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
                tempFormData[e.target.id] = {
                    values: inputData
                }
                setFormData(tempFormData);
                nextStep = 30;
                postData.answers = tempFormData;
                Connector.start('post',`https://apis.detroitmi.gov/property_applications/${appID}/answers/`,postData,true,props.token,'application/json',(e)=>{handleAPICalls(e, 'saveForm', step, nextStep)},(e)=>{handleAPICalls(e, 'saveForm', step)});
                // tempSynthoms = [];
                // let covidCout = 0;
                // Array.from(e.target.elements).forEach(element => {
                //     if(element.checked){
                //         tempSynthoms.push(element.id);
                //     }
                // });
                // if(tempSynthoms.length > 1){
                //     tempSynthoms.forEach((syn) => {
                //         (syn == 'other') ? 0 : covidCout++;
                //     });
                //     if(covidCout > 1){
                //         setStep(34);
                //     }else{
                //         setStep(30);
                //     }
                // }else{
                //     (tempSynthoms[0] == 'other') ? setStep(29) : setStep(30);
                // }
                break;

            case 30:
                for (let index = 0; index < e.target.elements.length; index++) {
                    if(e.target.elements[index].tagName == 'TEXTAREA'){
                        inputData.push(e.target.elements[index].value);
                    }
                }
                tempFormData = formData;
                tempFormData[e.target.id] = {
                    values: inputData
                }
                setFormData(tempFormData);
                nextStep = 31;
                postData.answers = tempFormData;
                Connector.start('post',`https://apis.detroitmi.gov/property_applications/${appID}/answers/`,postData,true,props.token,'application/json',(e)=>{handleAPICalls(e, 'saveForm', step, nextStep)},(e)=>{handleAPICalls(e, 'saveForm', step)});
                break;

            case 31:
                tempFormData = formData;
                tempFormData[e.target.id] = {
                    values: btnState
                }
                setFormData(tempFormData);
                nextStep = 32;
                postData.answers = tempFormData;
                Connector.start('post',`https://apis.detroitmi.gov/property_applications/${appID}/answers/`,postData,true,props.token,'application/json',(e)=>{handleAPICalls(e, 'saveForm', step, nextStep)},(e)=>{handleAPICalls(e, 'saveForm', step)});
                break;

            case 32:
                for (let index = 0; index < e.target.elements.length; index++) {
                    if(e.target.elements[index].tagName == 'INPUT' || e.target.elements[index].tagName == 'SELECT'){
                        inputData.push(e.target.elements[index].value);
                    }
                }
                tempFormData = formData;
                tempFormData[e.target.id] = {
                    values: inputData
                }
                setFormData(tempFormData);
                nextStep = 33;
                postData.answers = tempFormData;
                Connector.start('post',`https://apis.detroitmi.gov/property_applications/${appID}/answers/`,postData,true,props.token,'application/json',(e)=>{handleAPICalls(e, 'saveForm', step, nextStep)},(e)=>{handleAPICalls(e, 'saveForm', step)});
                break;

            case 33:
                postData = new FormData();
                for (let index = 0; index < e.target.elements.length; index++) {
                    if(e.target.elements[index].tagName == 'INPUT'){
                        if( e.target.elements[index].files.length > 0 ){
                            postData.append(e.target.elements[index].id, e.target.elements[index].files[0]);
                            attachments++;
                        }
                        
                    }
                }
                console.log(attachments);
                if(attachments > 0){
                    nextStep = 34;
                    Connector.start('post',`https://apis.detroitmi.gov/property_applications/${appID}/attachments/`,postData,true,props.token,'multipart/form',(e)=>{handleAPICalls(e, 'saveForm', step, nextStep)},(e)=>{handleAPICalls(e, 'saveForm', step)});
                }else{
                    tempHistory = stepHistory;
                    tempHistory.push(step);
                    setStepHistory(tempHistory);
                    setStep(34);
                }
                
                break;

            case 34:
                for (let index = 0; index < e.target.elements.length; index++) {
                    if(e.target.elements[index].tagName == 'INPUT'){
                        inputData.push(e.target.elements[index].value);
                    }
                }
                tempFormData = formData;
                tempFormData[e.target.id] = {
                    values: inputData
                }
                setFormData(tempFormData);
                // come back - needs to go last step
                nextStep = 35;
                postData.answers = tempFormData;
                Connector.start('post',`https://apis.detroitmi.gov/property_applications/${appID}/answers/`,postData,true,props.token,'application/json',(e)=>{handleAPICalls(e, 'saveForm', step, nextStep)},(e)=>{handleAPICalls(e, 'saveForm', step)});
                break;

            case 35:
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

            case 36:
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

            case 37:
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

    return (
        buildContent()
    )
}

export default Form;

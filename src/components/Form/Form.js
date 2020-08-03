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

    const checkPreviousAnswer = (item, index, tag, type) => {
        if(props.savedData){
            if(formData == undefined){
                return false;
            }else{
                if(formData[props.id] == undefined){
                    return false
                }else{
                    switch (tag) {
                        case 'button':
                            if(formData[props.id].values == item.text){
                                return true;
                            }else{
                                return false;
                            }
                            break;

                        case 'select':
                            return true;
                            break;

                        case 'GEOCODER':
                            return true;
                            break;

                        case 'textarea':
                            return true;
                            break;

                        case 'input':
                            switch (type) {
                                case 'radio':
                                    if(formData[props.id].values == item.value){
                                        return true;
                                    }else{
                                        return false;
                                    }
                                    break;

                                case 'checkbox':
                                    if(formData[props.id].values == item.value){
                                        return true;
                                    }else{
                                        return false;
                                    }
                                    break;
                            
                                default:
                                    return true;
                                    break;
                            }
                            break;
                    
                        default:
                            break;
                    }
                }
            }
        }else{
            return false;
        }
    }

    const buildTag = (item, index) =>{
        let markup;
        switch (item.tag) {
            case 'button':
                switch (item.type) {
                    case 'submit':
                        if(checkPreviousAnswer(item, index, item.tag, item.type)){
                            markup = <button className="selected" role="button" aria-label={item.name} onClick={(e)=>{setbtnState(e.target.innerText)}} type={item.type}>{item.text}</button>;
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
                if(checkPreviousAnswer(item, index, item.tag, item.type)){
                    markup = markup = <select id={item.id} name={item.name} aria-label={item.name} value={formData[props.id].values[index]}>{buildSelectOptions(item.id, item.selectOptions)}</select>;
                }else{
                    markup = <select id={item.id} name={item.name} aria-label={item.name} >{buildSelectOptions(item.id, item.selectOptions)}</select>;
                }
                break;

            case 'textarea':
                if(checkPreviousAnswer(item, index, item.tag, item.type)){
                    markup = <textarea id={item.id} name={item.name} value={formData[props.id].values[index]} aria-label={item.name} placeholder={item.placeholder} required={item.required} aria-required={item.required}></textarea>;
                }else{
                    markup = <textarea id={item.id} name={item.name} aria-label={item.name} placeholder={item.placeholder} required={item.required} aria-required={item.required}></textarea>;
                }
                break;

            case 'GEOCODER':
                if(checkPreviousAnswer(item, index, item.tag, item.type)){
                    markup = 
                    <Geocoder 
                    id={item.id} 
                    name={item.name} 
                    placeholder={formData[props.id].values[index]} 
                    required={false}
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
                    value={item.value}
                    ></Geocoder>;
                }
                break;
        
            default:
                switch (item.type) {
                    case 'radio':
                        markup = addspecialType(item, index);
                        break;

                    case 'checkbox':
                        markup = <input type={item.type} id={item.id} name={item.name} aria-label={item.name} value={item.value} onChange={handleChange} required={item.required} aria-required={item.required} onChange={handleGroupingRequired} data-grouping={item.grouping}></input>;
                        break;
                    
                    case 'text':
                        if(checkPreviousAnswer(item, index, item.tag, item.type)){
                            markup = <input type={item.type} id={item.id} name={item.name} value={formData[props.id].values[index]} aria-label={item.name} disabled={item.disabled} placeholder={item.placeholder} required={item.required} aria-required={item.required}></input>;
                        }else{
                            markup = <input type={item.type} id={item.id} name={item.name} aria-label={item.name} disabled={item.disabled} placeholder={item.placeholder} required={item.required} aria-required={item.required}></input>;
                        }
                        break;

                    case 'file':
                        markup = <input type={item.type} id={item.id} name={item.name} aria-label={item.name} disabled={item.disabled} required={item.required} aria-required={item.required}></input>;
                        break;

                    case 'number':
                        if(checkPreviousAnswer(item, index, item.tag, item.type)){
                            markup = <input type={item.type} id={item.id} name={item.name} value={formData[props.id].values[index]} aria-label={item.name} disabled={item.disabled} placeholder={item.placeholder} required={item.required} aria-required={item.required}></input>;
                        }else{
                            markup = <input type={item.type} id={item.id} name={item.name} aria-label={item.name} disabled={item.disabled} placeholder={item.placeholder} required={item.required} aria-required={item.required}></input>;
                        }
                        break;

                    case 'date':
                        if(checkPreviousAnswer(item, index, item.tag, item.type)){
                            markup = <input type={item.type} id={item.id} name={item.name} value={formData[props.id].values[index]} aria-label={item.name} disabled={item.disabled} placeholder={item.placeholder} required={item.required} aria-required={item.required}></input>;
                        }else{
                            markup = <input type={item.type} id={item.id} name={item.name} aria-label={item.name} disabled={item.disabled} placeholder={item.placeholder} required={item.required} aria-required={item.required}></input>;
                        }
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

    const addspecialType = (item, index) => {
        if(item.hasSpecialAttribute){
            if(checkPreviousAnswer(item, index, item.tag, item.type)){
                return <input type={item.type} id={item.id} name={item.name} value={item.value} onChange={handleChange} required={item.required} aria-required={item.required} data-special-type={item.specialAttribute} data-special-text={item.otherPlaceholder} data-special-label={item.otherLabel} data-special-id={item.otherID} checked='true'></input>;
            }else{
                return <input type={item.type} id={item.id} name={item.name} value={item.value} onChange={handleChange} required={item.required} aria-required={item.required} data-special-type={item.specialAttribute} data-special-text={item.otherPlaceholder} data-special-label={item.otherLabel} data-special-id={item.otherID}></input>;
            }
        }else{
            if(checkPreviousAnswer(item, index, item.tag, item.type)){
                return <input type={item.type} id={item.id} name={item.name} value={item.value} onChange={handleChange} required={item.required} aria-required={item.required} checked='true'></input>;
            }else{
                return <input type={item.type} id={item.id} name={item.name} value={item.value} onChange={handleChange} required={item.required} aria-required={item.required}></input>;
            }
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
                        case 34:
                            Connector.start('post',`https://apis.detroitmi.gov/property_applications/${appID}/finish/`,null,true,props.token,'application/json',(e)=>{handleAPICalls(e, 'finish', currentStep, nextStep)},(e)=>{handleAPICalls(e, 'finish', currentStep)});
                            break;

                        case 69:
                            Connector.start('post',`https://apis.detroitmi.gov/property_applications/${appID}/finish/`,null,true,props.token,'application/json',(e)=>{handleAPICalls(e, 'finish', currentStep, nextStep)},(e)=>{handleAPICalls(e, 'finish', currentStep)});
                            break;

                        case 70:
                            Connector.start('post',`https://apis.detroitmi.gov/property_applications/${appID}/finish/`,null,true,props.token,'application/json',(e)=>{handleAPICalls(e, 'finish', currentStep, nextStep)},(e)=>{handleAPICalls(e, 'finish', currentStep)});
                            break;

                        case 79:
                            Connector.start('post',`https://apis.detroitmi.gov/property_applications/${appID}/finish/`,null,true,props.token,'application/json',(e)=>{handleAPICalls(e, 'finish', currentStep, nextStep)},(e)=>{handleAPICalls(e, 'finish', currentStep)});
                            break;

                        case 80:
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

                            case "Finish Previous Application":
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
                    if(e.target.elements[index].tagName == 'INPUT' || e.target.elements[index].tagName == 'SELECT'){
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
                    if(e.target.elements[index].tagName == 'INPUT' || e.target.elements[index].tagName == 'SELECT'){
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
                if(inputData.length > 0 && inputData[0] != ''){
                    tempFormData[e.target.id] = {
                        values: inputData
                    }
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
                        // (e.target.elements[index].getAttribute('data-parcel') == null) ? '' : inputData.push(e.target.elements[index].getAttribute('data-parcel'));
                    }
                }
                tempFormData = formData;
                if(inputData.length > 0 && inputData[0] != ''){
                    tempFormData[e.target.id] = {
                        values: inputData
                    }
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
                if(inputData.length > 0 && inputData[0] != ''){
                    tempFormData[e.target.id] = {
                        values: inputData
                    }
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
                    nextStep = 58;
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
                    nextStep = 58;
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

                        case "land-based-project":
                            nextStep = 35;
                            break;

                        case "commercial-land-lease-temporary":
                            nextStep = 58;
                            break;

                        case "film":
                            nextStep = 58;
                            break;

                        case "cell-tower":
                            nextStep = 58;
                            break;

                        case "public-gathering":
                            nextStep = 58;
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
                nextStep = 81;
                postData.answers = tempFormData;
                Connector.start('post',`https://apis.detroitmi.gov/property_applications/${appID}/answers/`,postData,true,props.token,'application/json',(e)=>{handleAPICalls(e, 'saveForm', step, nextStep)},(e)=>{handleAPICalls(e, 'saveForm', step)});
                break;

            case 35:
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
                nextStep = 36;
                postData.answers = tempFormData;
                Connector.start('post',`https://apis.detroitmi.gov/property_applications/${appID}/answers/`,postData,true,props.token,'application/json',(e)=>{handleAPICalls(e, 'saveForm', step, nextStep)},(e)=>{handleAPICalls(e, 'saveForm', step)});
                break;

            case 36:
                tempFormData = formData;
                tempFormData[e.target.id] = {
                    values: btnState
                }
                setFormData(tempFormData);
                if(btnState == "Yes"){
                    nextStep = 37;
                }else{
                    nextStep = 39;
                }
                postData.answers = tempFormData;
                Connector.start('post',`https://apis.detroitmi.gov/property_applications/${appID}/answers/`,postData,true,props.token,'application/json',(e)=>{handleAPICalls(e, 'saveForm', step, nextStep)},(e)=>{handleAPICalls(e, 'saveForm', step)});
                break;

            case 37:
                tempFormData = formData;
                tempFormData[e.target.id] = {
                    values: btnState
                }
                setFormData(tempFormData);
                if(btnState == "Yes"){
                    nextStep = 38;
                }else{
                    nextStep = 39;
                }
                postData.answers = tempFormData;
                Connector.start('post',`https://apis.detroitmi.gov/property_applications/${appID}/answers/`,postData,true,props.token,'application/json',(e)=>{handleAPICalls(e, 'saveForm', step, nextStep)},(e)=>{handleAPICalls(e, 'saveForm', step)});
                break;

            case 38:
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
                nextStep = 39;
                postData.answers = tempFormData;
                Connector.start('post',`https://apis.detroitmi.gov/property_applications/${appID}/answers/`,postData,true,props.token,'application/json',(e)=>{handleAPICalls(e, 'saveForm', step, nextStep)},(e)=>{handleAPICalls(e, 'saveForm', step)});
                break;

            case 39:
                tempFormData = formData;
                tempFormData[e.target.id] = {
                    values: btnState
                }
                setFormData(tempFormData);
                if(btnState == "Yes"){
                    nextStep = 40;
                }else{
                    nextStep = 41;
                }
                postData.answers = tempFormData;
                Connector.start('post',`https://apis.detroitmi.gov/property_applications/${appID}/answers/`,postData,true,props.token,'application/json',(e)=>{handleAPICalls(e, 'saveForm', step, nextStep)},(e)=>{handleAPICalls(e, 'saveForm', step)});
                break;

            case 40:
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
                nextStep = 41;
                postData.answers = tempFormData;
                Connector.start('post',`https://apis.detroitmi.gov/property_applications/${appID}/answers/`,postData,true,props.token,'application/json',(e)=>{handleAPICalls(e, 'saveForm', step, nextStep)},(e)=>{handleAPICalls(e, 'saveForm', step)});
                break;

            case 41:
                tempFormData = formData;
                tempFormData[e.target.id] = {
                    values: btnState
                }
                setFormData(tempFormData);
                if(btnState == "Yes"){
                    nextStep = 42;
                }else{
                    nextStep = 43;
                }
                postData.answers = tempFormData;
                Connector.start('post',`https://apis.detroitmi.gov/property_applications/${appID}/answers/`,postData,true,props.token,'application/json',(e)=>{handleAPICalls(e, 'saveForm', step, nextStep)},(e)=>{handleAPICalls(e, 'saveForm', step)});
                break;

            case 42:
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
                nextStep = 43;
                postData.answers = tempFormData;
                Connector.start('post',`https://apis.detroitmi.gov/property_applications/${appID}/answers/`,postData,true,props.token,'application/json',(e)=>{handleAPICalls(e, 'saveForm', step, nextStep)},(e)=>{handleAPICalls(e, 'saveForm', step)});
                break;

            case 43:
                specialType = false;
                for (let index = 0; index < e.target.elements.length; index++) {
                    if(e.target.elements[index].tagName == 'INPUT'){
                        if(e.target.elements[index].type == 'checkbox'){
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
                nextStep = 44;
                postData.answers = tempFormData;
                Connector.start('post',`https://apis.detroitmi.gov/property_applications/${appID}/answers/`,postData,true,props.token,'application/json',(e)=>{handleAPICalls(e, 'saveForm', step, nextStep)},(e)=>{handleAPICalls(e, 'saveForm', step)});
                break;

            case 44:
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
                nextStep = 45;
                postData.answers = tempFormData;
                Connector.start('post',`https://apis.detroitmi.gov/property_applications/${appID}/answers/`,postData,true,props.token,'application/json',(e)=>{handleAPICalls(e, 'saveForm', step, nextStep)},(e)=>{handleAPICalls(e, 'saveForm', step)});
                break;

            case 45:
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
                    nextStep = 46;
                    Connector.start('post',`https://apis.detroitmi.gov/property_applications/${appID}/attachments/`,postData,true,props.token,'multipart/form',(e)=>{handleAPICalls(e, 'saveForm', step, nextStep)},(e)=>{handleAPICalls(e, 'saveForm', step)});
                }else{
                    tempHistory = stepHistory;
                    tempHistory.push(step);
                    setStepHistory(tempHistory);
                    setStep(46);
                }
                break;

            case 46:
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
                nextStep = 47;
                postData.answers = tempFormData;
                Connector.start('post',`https://apis.detroitmi.gov/property_applications/${appID}/answers/`,postData,true,props.token,'application/json',(e)=>{handleAPICalls(e, 'saveForm', step, nextStep)},(e)=>{handleAPICalls(e, 'saveForm', step)});
                break;

            case 47:
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
                    nextStep = 48;
                    Connector.start('post',`https://apis.detroitmi.gov/property_applications/${appID}/attachments/`,postData,true,props.token,'multipart/form',(e)=>{handleAPICalls(e, 'saveForm', step, nextStep)},(e)=>{handleAPICalls(e, 'saveForm', step)});
                }else{
                    tempHistory = stepHistory;
                    tempHistory.push(step);
                    setStepHistory(tempHistory);
                    setStep(48);
                }
                break;

            case 48:
                tempFormData = formData;
                tempFormData[e.target.id] = {
                    values: btnState
                }
                setFormData(tempFormData);
                if(btnState == "Yes"){
                    nextStep = 49;
                }else{
                    nextStep = 50;
                }
                postData.answers = tempFormData;
                Connector.start('post',`https://apis.detroitmi.gov/property_applications/${appID}/answers/`,postData,true,props.token,'application/json',(e)=>{handleAPICalls(e, 'saveForm', step, nextStep)},(e)=>{handleAPICalls(e, 'saveForm', step)});
                break;

            case 49:
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
                    nextStep = 50;
                    Connector.start('post',`https://apis.detroitmi.gov/property_applications/${appID}/attachments/`,postData,true,props.token,'multipart/form',(e)=>{handleAPICalls(e, 'saveForm', step, nextStep)},(e)=>{handleAPICalls(e, 'saveForm', step)});
                }else{
                    tempHistory = stepHistory;
                    tempHistory.push(step);
                    setStepHistory(tempHistory);
                    setStep(50);
                }
                break;

            case 50:
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
                nextStep = 51;
                postData.answers = tempFormData;
                Connector.start('post',`https://apis.detroitmi.gov/property_applications/${appID}/answers/`,postData,true,props.token,'application/json',(e)=>{handleAPICalls(e, 'saveForm', step, nextStep)},(e)=>{handleAPICalls(e, 'saveForm', step)});
                break;

            case 51:
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
                nextStep = 52;
                postData.answers = tempFormData;
                Connector.start('post',`https://apis.detroitmi.gov/property_applications/${appID}/answers/`,postData,true,props.token,'application/json',(e)=>{handleAPICalls(e, 'saveForm', step, nextStep)},(e)=>{handleAPICalls(e, 'saveForm', step)});
                break;

            case 52:
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
                nextStep = 53;
                postData.answers = tempFormData;
                Connector.start('post',`https://apis.detroitmi.gov/property_applications/${appID}/answers/`,postData,true,props.token,'application/json',(e)=>{handleAPICalls(e, 'saveForm', step, nextStep)},(e)=>{handleAPICalls(e, 'saveForm', step)});
                break;

            case 53:
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
                nextStep = 54;
                postData.answers = tempFormData;
                Connector.start('post',`https://apis.detroitmi.gov/property_applications/${appID}/answers/`,postData,true,props.token,'application/json',(e)=>{handleAPICalls(e, 'saveForm', step, nextStep)},(e)=>{handleAPICalls(e, 'saveForm', step)});
                break;

            case 54:
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
                nextStep = 55;
                postData.answers = tempFormData;
                Connector.start('post',`https://apis.detroitmi.gov/property_applications/${appID}/answers/`,postData,true,props.token,'application/json',(e)=>{handleAPICalls(e, 'saveForm', step, nextStep)},(e)=>{handleAPICalls(e, 'saveForm', step)});
                break;

            case 55:
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
                nextStep = 56;
                postData.answers = tempFormData;
                Connector.start('post',`https://apis.detroitmi.gov/property_applications/${appID}/answers/`,postData,true,props.token,'application/json',(e)=>{handleAPICalls(e, 'saveForm', step, nextStep)},(e)=>{handleAPICalls(e, 'saveForm', step)});
                break;

            case 56:
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
                nextStep = 57;
                postData.answers = tempFormData;
                Connector.start('post',`https://apis.detroitmi.gov/property_applications/${appID}/answers/`,postData,true,props.token,'application/json',(e)=>{handleAPICalls(e, 'saveForm', step, nextStep)},(e)=>{handleAPICalls(e, 'saveForm', step)});
                break;

            case 57:
                postData = new FormData();
                for (let index = 0; index < e.target.elements.length; index++) {
                    if(e.target.elements[index].tagName == 'INPUT'){
                        if( e.target.elements[index].files.length > 0 ){
                            postData.append(e.target.elements[index].id, e.target.elements[index].files[0]);
                            attachments++;
                        }
                        
                    }
                }
                if(attachments > 0){
                    nextStep = 58;
                    Connector.start('post',`https://apis.detroitmi.gov/property_applications/${appID}/attachments/`,postData,true,props.token,'multipart/form',(e)=>{handleAPICalls(e, 'saveForm', step, nextStep)},(e)=>{handleAPICalls(e, 'saveForm', step)});
                }else{
                    tempHistory = stepHistory;
                    tempHistory.push(step);
                    setStepHistory(tempHistory);
                    setStep(58);
                }
                break;

            case 58:
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
                switch (formData.propertyUse.values[0]) {
                    case "commercial-lease":
                        nextStep = 59;
                        break;

                    case "filming":
                        nextStep = 71;
                        break;

                    case "cell-tower":
                        nextStep = 74;
                        break;

                    case "public-gathering":
                        nextStep = 75;
                        break;

                    case "other":
                        // come back
                        nextStep = 80;
                        break;
                
                    default:
                        break;
                }
                postData.answers = tempFormData;
                Connector.start('post',`https://apis.detroitmi.gov/property_applications/${appID}/answers/`,postData,true,props.token,'application/json',(e)=>{handleAPICalls(e, 'saveForm', step, nextStep)},(e)=>{handleAPICalls(e, 'saveForm', step)});
                break;

            case 59:
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
                nextStep = 60;
                postData.answers = tempFormData;
                Connector.start('post',`https://apis.detroitmi.gov/property_applications/${appID}/answers/`,postData,true,props.token,'application/json',(e)=>{handleAPICalls(e, 'saveForm', step, nextStep)},(e)=>{handleAPICalls(e, 'saveForm', step)});
                break;

            case 60:
                tempFormData = formData;
                tempFormData[e.target.id] = {
                    values: btnState
                }
                setFormData(tempFormData);
                if(btnState == "Yes"){
                    nextStep = 61;
                }else{
                    nextStep = 63;
                }
                postData.answers = tempFormData;
                Connector.start('post',`https://apis.detroitmi.gov/property_applications/${appID}/answers/`,postData,true,props.token,'application/json',(e)=>{handleAPICalls(e, 'saveForm', step, nextStep)},(e)=>{handleAPICalls(e, 'saveForm', step)});
                break;

            case 61:
                tempFormData = formData;
                tempFormData[e.target.id] = {
                    values: btnState
                }
                setFormData(tempFormData);
                if(btnState == "Yes"){
                    nextStep = 62;
                }else{
                    nextStep = 63;
                }
                postData.answers = tempFormData;
                Connector.start('post',`https://apis.detroitmi.gov/property_applications/${appID}/answers/`,postData,true,props.token,'application/json',(e)=>{handleAPICalls(e, 'saveForm', step, nextStep)},(e)=>{handleAPICalls(e, 'saveForm', step)});
                break;

            case 62:
                break;

            case 63:
                tempFormData = formData;
                tempFormData[e.target.id] = {
                    values: btnState
                }
                setFormData(tempFormData);
                if(btnState == "Yes"){
                    nextStep = 64;
                }else{
                    nextStep = 65;
                }
                postData.answers = tempFormData;
                Connector.start('post',`https://apis.detroitmi.gov/property_applications/${appID}/answers/`,postData,true,props.token,'application/json',(e)=>{handleAPICalls(e, 'saveForm', step, nextStep)},(e)=>{handleAPICalls(e, 'saveForm', step)});
                break;

            case 64:
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
                nextStep = 65;
                postData.answers = tempFormData;
                Connector.start('post',`https://apis.detroitmi.gov/property_applications/${appID}/answers/`,postData,true,props.token,'application/json',(e)=>{handleAPICalls(e, 'saveForm', step, nextStep)},(e)=>{handleAPICalls(e, 'saveForm', step)});
                break;

            case 65:
                tempFormData = formData;
                tempFormData[e.target.id] = {
                    values: btnState
                }
                setFormData(tempFormData);
                nextStep = 66;
                postData.answers = tempFormData;
                Connector.start('post',`https://apis.detroitmi.gov/property_applications/${appID}/answers/`,postData,true,props.token,'application/json',(e)=>{handleAPICalls(e, 'saveForm', step, nextStep)},(e)=>{handleAPICalls(e, 'saveForm', step)});
                break;

            case 66:
                tempFormData = formData;
                tempFormData[e.target.id] = {
                    values: btnState
                }
                setFormData(tempFormData);
                if(btnState == "Yes"){
                    nextStep = 67;
                }else{
                    nextStep = 68;
                }
                postData.answers = tempFormData;
                Connector.start('post',`https://apis.detroitmi.gov/property_applications/${appID}/answers/`,postData,true,props.token,'application/json',(e)=>{handleAPICalls(e, 'saveForm', step, nextStep)},(e)=>{handleAPICalls(e, 'saveForm', step)});
                break;

            case 67:
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
                nextStep = 69;
                postData.answers = tempFormData;
                Connector.start('post',`https://apis.detroitmi.gov/property_applications/${appID}/answers/`,postData,true,props.token,'application/json',(e)=>{handleAPICalls(e, 'saveForm', step, nextStep)},(e)=>{handleAPICalls(e, 'saveForm', step)});
                break;

            case 68:
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
                nextStep = 69;
                postData.answers = tempFormData;
                Connector.start('post',`https://apis.detroitmi.gov/property_applications/${appID}/answers/`,postData,true,props.token,'application/json',(e)=>{handleAPICalls(e, 'saveForm', step, nextStep)},(e)=>{handleAPICalls(e, 'saveForm', step)});
                break;

            case 69:
                tempFormData = formData;
                tempFormData[e.target.id] = {
                    values: btnState
                }
                setFormData(tempFormData);
                if(btnState == "Yes"){
                    nextStep = 70;
                }else{
                    nextStep = 81;
                }
                postData.answers = tempFormData;
                Connector.start('post',`https://apis.detroitmi.gov/property_applications/${appID}/answers/`,postData,true,props.token,'application/json',(e)=>{handleAPICalls(e, 'saveForm', step, nextStep)},(e)=>{handleAPICalls(e, 'saveForm', step)});
                break;

            case 70:
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
                nextStep = 81;
                postData.answers = tempFormData;
                Connector.start('post',`https://apis.detroitmi.gov/property_applications/${appID}/answers/`,postData,true,props.token,'application/json',(e)=>{handleAPICalls(e, 'saveForm', step, nextStep)},(e)=>{handleAPICalls(e, 'saveForm', step)});
                break;

            case 71:
                tempFormData = formData;
                tempFormData[e.target.id] = {
                    values: btnState
                }
                setFormData(tempFormData);
                if(btnState == "Yes"){
                    nextStep = 72;
                }else{
                    nextStep = 73;
                }
                postData.answers = tempFormData;
                Connector.start('post',`https://apis.detroitmi.gov/property_applications/${appID}/answers/`,postData,true,props.token,'application/json',(e)=>{handleAPICalls(e, 'saveForm', step, nextStep)},(e)=>{handleAPICalls(e, 'saveForm', step)});
                break;

            case 72:
                postData = new FormData();
                for (let index = 0; index < e.target.elements.length; index++) {
                    if(e.target.elements[index].tagName == 'INPUT'){
                        if( e.target.elements[index].files.length > 0 ){
                            postData.append(e.target.elements[index].id, e.target.elements[index].files[0]);
                            attachments++;
                        }
                        
                    }
                }
                if(attachments > 0){
                    nextStep = 74;
                    Connector.start('post',`https://apis.detroitmi.gov/property_applications/${appID}/attachments/`,postData,true,props.token,'multipart/form',(e)=>{handleAPICalls(e, 'saveForm', step, nextStep)},(e)=>{handleAPICalls(e, 'saveForm', step)});
                }else{
                    tempHistory = stepHistory;
                    tempHistory.push(step);
                    setStepHistory(tempHistory);
                    setStep(74);
                }
                break;

            case 73:
                break;

            case 74:
                break;

            case 75:
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
                switch (formData.propertyUse.values[0]) {
                    case "concert":
                        nextStep = 76;
                        break;

                    case "festival":
                        nextStep = 76;
                        break;

                    case "parade":
                        nextStep = 76;
                        break;

                    case "block-party":
                        nextStep = 77;
                        break;

                    case "picnic":
                        nextStep = 77;
                        break;

                    case "other":
                        nextStep = 77;
                        break;
                
                    default:
                        break;
                }
                postData.answers = tempFormData;
                Connector.start('post',`https://apis.detroitmi.gov/property_applications/${appID}/answers/`,postData,true,props.token,'application/json',(e)=>{handleAPICalls(e, 'saveForm', step, nextStep)},(e)=>{handleAPICalls(e, 'saveForm', step)});
                break;

            case 76:
                tempHistory = stepHistory;
                tempHistory.push(step);
                setStepHistory(tempHistory);
                setStep(77);
                break;

            case 77:
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
                nextStep = 78;
                postData.answers = tempFormData;
                Connector.start('post',`https://apis.detroitmi.gov/property_applications/${appID}/answers/`,postData,true,props.token,'application/json',(e)=>{handleAPICalls(e, 'saveForm', step, nextStep)},(e)=>{handleAPICalls(e, 'saveForm', step)});
                break;

            case 78:
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
                nextStep = 79;
                postData.answers = tempFormData;
                Connector.start('post',`https://apis.detroitmi.gov/property_applications/${appID}/answers/`,postData,true,props.token,'application/json',(e)=>{handleAPICalls(e, 'saveForm', step, nextStep)},(e)=>{handleAPICalls(e, 'saveForm', step)});
                break;

            case 79:
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
                nextStep = 81;
                postData.answers = tempFormData;
                Connector.start('post',`https://apis.detroitmi.gov/property_applications/${appID}/answers/`,postData,true,props.token,'application/json',(e)=>{handleAPICalls(e, 'saveForm', step, nextStep)},(e)=>{handleAPICalls(e, 'saveForm', step)});
                break;

            case 80:
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
                nextStep = 81;
                postData.answers = tempFormData;
                Connector.start('post',`https://apis.detroitmi.gov/property_applications/${appID}/answers/`,postData,true,props.token,'application/json',(e)=>{handleAPICalls(e, 'saveForm', step, nextStep)},(e)=>{handleAPICalls(e, 'saveForm', step)});
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

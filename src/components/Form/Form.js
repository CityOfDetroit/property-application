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
                    tempHistory = stepHistory;
                    tempHistory.push(currentStep);
                    setStepHistory(tempHistory);
                    setStep(nextStep);
                    break;

                default:
                    break;
            }
        }else{

        }
    }

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
            extrasArr.push(`${extras.getAttribute('data-special-id')}-${index}`);
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
                        markup = <button role="button" aria-label={item.name} onClick={(e)=>{setExtrasCount(extrasCount + 1); setExtras(e.target)}} type={item.type} data-special-type={item.specialAttribute} data-special-text={item.otherPlaceholder} data-special-label={item.otherLabel} data-special-id={item.otherID}>{item.text}</button>;
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

                    case 'file':
                        markup = <input type={item.type} id={item.id} name={item.name} aria-label={item.name} disabled={item.disabled} required={item.required} aria-required={item.required}></input>;
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
        let specialType  = false;
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
                        Connector.start('post','https://apis.detroitmi.gov/property_applications/start/',null,true,props.token,(e)=>{handleAPICalls(e, 'getID', step, 2)},(e)=>{handleAPICalls(e, 'getID', step)});
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
                            values: btnState
                        }
                        setFormData(tempFormData);
                        postData.answers = tempFormData;
                        Connector.start('post',`https://apis.detroitmi.gov/property_applications/${appID}/answers/`,postData,true,props.token,(e)=>{handleAPICalls(e, 'saveForm', step, 3)},(e)=>{handleAPICalls(e, 'saveForm', step)});
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
                            values: inputData
                        }
                        postData.answers = tempFormData;
                        Connector.start('post',`https://apis.detroitmi.gov/property_applications/${appID}/answers/`,postData,true,props.token,(e)=>{handleAPICalls(e, 'saveForm', step, 4)},(e)=>{handleAPICalls(e, 'saveForm', step)});
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
                        tempFormData.applicantType = {
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
                        postData.answers = tempFormData;
                        Connector.start('post',`https://apis.detroitmi.gov/property_applications/${appID}/answers/`,postData,true,props.token,(e)=>{handleAPICalls(e, 'saveForm', step, nextStep)},(e)=>{handleAPICalls(e, 'saveForm', step)});
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
                    values: inputData
                }
                nextStep = 7;
                postData.answers = tempFormData;
                Connector.start('post',`https://apis.detroitmi.gov/property_applications/${appID}/answers/`,postData,true,props.token,(e)=>{handleAPICalls(e, 'saveForm', step, nextStep)},(e)=>{handleAPICalls(e, 'saveForm', step)});
                break;

            case 6:
                for (let index = 0; index < e.target.elements.length; index++) {
                    if(e.target.elements[index].tagName == 'INPUT'){
                        inputData.push(e.target.elements[index].value);
                    }
                }
                tempFormData = formData;
                tempFormData.contactIndividual = {
                    values: inputData
                }
                nextStep = 7;
                postData.answers = tempFormData;
                Connector.start('post',`https://apis.detroitmi.gov/property_applications/${appID}/answers/`,postData,true,props.token,(e)=>{handleAPICalls(e, 'saveForm', step, nextStep)},(e)=>{handleAPICalls(e, 'saveForm', step)});
                break;

            case 7:
                tempFormData = formData;
                tempFormData.inDetroit = {
                    values: btnState
                }
                setFormData(tempFormData);
                nextStep = 8;
                postData.answers = tempFormData;
                Connector.start('post',`https://apis.detroitmi.gov/property_applications/${appID}/answers/`,postData,true,props.token,(e)=>{handleAPICalls(e, 'saveForm', step, nextStep)},(e)=>{handleAPICalls(e, 'saveForm', step)});
                break;

            case 8:
                tempFormData = formData;
                tempFormData.DLBACommunityPartner = {
                    values: btnState
                }
                setFormData(tempFormData);
                if(btnState == "Yes"){
                    nextStep = 9;
                }else{
                    nextStep = 10;
                }
                postData.answers = tempFormData;
                Connector.start('post',`https://apis.detroitmi.gov/property_applications/${appID}/answers/`,postData,true,props.token,(e)=>{handleAPICalls(e, 'saveForm', step, nextStep)},(e)=>{handleAPICalls(e, 'saveForm', step)});
                break;

            case 9:
                for (let index = 0; index < e.target.elements.length; index++) {
                    if(e.target.elements[index].tagName == 'TEXTAREA'){
                        inputData.push(e.target.elements[index].value);
                    }
                }
                tempFormData = formData;
                tempFormData.partnerList = {
                    values: inputData
                }
                setFormData(tempFormData);
                nextStep = 10;
                postData.answers = tempFormData;
                Connector.start('post',`https://apis.detroitmi.gov/property_applications/${appID}/answers/`,postData,true,props.token,(e)=>{handleAPICalls(e, 'saveForm', step, nextStep)},(e)=>{handleAPICalls(e, 'saveForm', step)});
                break;

            case 10:
                tempFormData = formData;
                tempFormData.ownDetroitProperty = {
                    values: btnState
                }
                setFormData(tempFormData);
                if(btnState == "Yes"){
                    nextStep = 11;
                }else{
                    nextStep = 12;
                }
                postData.answers = tempFormData;
                Connector.start('post',`https://apis.detroitmi.gov/property_applications/${appID}/answers/`,postData,true,props.token,(e)=>{handleAPICalls(e, 'saveForm', step, nextStep)},(e)=>{handleAPICalls(e, 'saveForm', step)});
                break;

            case 11:
                for (let index = 0; index < e.target.elements.length; index++) {
                    if(e.target.elements[index].tagName == 'INPUT'){
                        inputData.push(e.target.elements[index].value);
                        (e.target.elements[index].getAttribute('data-parcel') == null) ? inputData.push('') : inputData.push(e.target.elements[index].getAttribute('data-parcel'));
                    }
                }
                tempFormData = formData;
                tempFormData.detroitProperties = {
                    values: inputData
                }
                setFormData(tempFormData);
                setStepHistory(tempHistory);
                setExtrasCount(0);
                setExtras(undefined);
                nextStep = 12;
                postData.answers = tempFormData;
                Connector.start('post',`https://apis.detroitmi.gov/property_applications/${appID}/answers/`,postData,true,props.token,(e)=>{handleAPICalls(e, 'saveForm', step, nextStep)},(e)=>{handleAPICalls(e, 'saveForm', step)});
                break;

            case 12:
                for (let index = 0; index < e.target.elements.length; index++) {
                    if(e.target.elements[index].tagName == 'INPUT'){
                        inputData.push(e.target.elements[index].value);
                    }
                }
                tempFormData = formData;
                tempFormData.LLCs = {
                    values: inputData
                }
                setFormData(tempFormData);
                nextStep = 13;
                postData.answers = tempFormData;
                Connector.start('post',`https://apis.detroitmi.gov/property_applications/${appID}/answers/`,postData,true,props.token,(e)=>{handleAPICalls(e, 'saveForm', step, nextStep)},(e)=>{handleAPICalls(e, 'saveForm', step)});
                break;

            case 13:
                tempFormData = formData;
                tempFormData.delinquencyStatus = {
                    values: btnState
                }
                setFormData(tempFormData);
                if(btnState == "Yes"){
                    nextStep = 14
                }else{
                    nextStep = 15;
                }
                postData.answers = tempFormData;
                Connector.start('post',`https://apis.detroitmi.gov/property_applications/${appID}/answers/`,postData,true,props.token,(e)=>{handleAPICalls(e, 'saveForm', step, nextStep)},(e)=>{handleAPICalls(e, 'saveForm', step)});
                break;

            case 14:
                break;

            case 15:
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
                tempFormData.identifiedProperty = {
                    values: btnState
                }
                setFormData(tempFormData);
                if(btnState == "Yes"){
                    nextStep = 17;
                }else{
                    nextStep = 18;
                }
                postData.answers = tempFormData;
                Connector.start('post',`https://apis.detroitmi.gov/property_applications/${appID}/answers/`,postData,true,props.token,(e)=>{handleAPICalls(e, 'saveForm', step, nextStep)},(e)=>{handleAPICalls(e, 'saveForm', step)});
                break;

            case 16:
                break;

            case 17:
                for (let index = 0; index < e.target.elements.length; index++) {
                    if(e.target.elements[index].tagName == 'INPUT'){
                        inputData.push(e.target.elements[index].value);
                        (e.target.elements[index].getAttribute('data-parcel') == null) ? inputData.push('') : inputData.push(e.target.elements[index].getAttribute('data-parcel'));
                    }
                }
                tempFormData = formData;
                tempFormData.interestedProperty = {
                    values: inputData
                }
                setFormData(tempFormData);
                setExtrasCount(0);
                setExtras(undefined);
                nextStep = 18;
                postData.answers = tempFormData;
                Connector.start('post',`https://apis.detroitmi.gov/property_applications/${appID}/answers/`,postData,true,props.token,(e)=>{handleAPICalls(e, 'saveForm', step, nextStep)},(e)=>{handleAPICalls(e, 'saveForm', step)});
                break;

            case 18:
                tempFormData = formData;
                tempFormData.adjacentPropertyisOwned = {
                    values: btnState
                }
                setFormData(tempFormData);
                if(btnState == "Yes"){
                    nextStep = 19;
                }else{
                    nextStep = 20;
                }
                postData.answers = tempFormData;
                Connector.start('post',`https://apis.detroitmi.gov/property_applications/${appID}/answers/`,postData,true,props.token,(e)=>{handleAPICalls(e, 'saveForm', step, nextStep)},(e)=>{handleAPICalls(e, 'saveForm', step)});
                break;

            case 19:
                for (let index = 0; index < e.target.elements.length; index++) {
                    if(e.target.elements[index].tagName == 'INPUT'){
                        inputData.push(e.target.elements[index].value);
                        (e.target.elements[index].getAttribute('data-parcel') == null) ? inputData.push('') : inputData.push(e.target.elements[index].getAttribute('data-parcel'));
                    }
                }
                tempFormData = formData;
                tempFormData.adjacentProperty = {
                    values: inputData
                }
                setFormData(tempFormData);
                setExtrasCount(0);
                setExtras(undefined);
                nextStep = 20;
                postData.answers = tempFormData;
                Connector.start('post',`https://apis.detroitmi.gov/property_applications/${appID}/answers/`,postData,true,props.token,(e)=>{handleAPICalls(e, 'saveForm', step, nextStep)},(e)=>{handleAPICalls(e, 'saveForm', step)});
                break;

            case 20:
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
                tempFormData.previouslyOwnRent = {
                    values: btnState
                }
                setFormData(tempFormData);
                nextStep = 21;
                postData.answers = tempFormData;
                Connector.start('post',`https://apis.detroitmi.gov/property_applications/${appID}/answers/`,postData,true,props.token,(e)=>{handleAPICalls(e, 'saveForm', step, nextStep)},(e)=>{handleAPICalls(e, 'saveForm', step)});
                break; 

            case 21:
                tempFormData = formData;
                tempFormData.purchaseOrLease = {
                    values: btnState
                }
                setFormData(tempFormData);
                if(btnState == "Purchase"){
                    setStep(22);
                    nextStep = 22;
                }else{
                    //come back
                    nextStep = 20;
                }
                postData.answers = tempFormData;
                Connector.start('post',`https://apis.detroitmi.gov/property_applications/${appID}/answers/`,postData,true,props.token,(e)=>{handleAPICalls(e, 'saveForm', step, nextStep)},(e)=>{handleAPICalls(e, 'saveForm', step)});
                break;

            case 22:
                for (let index = 0; index < e.target.elements.length; index++) {
                    if(e.target.elements[index].tagName == 'INPUT'){
                        inputData.push(e.target.elements[index].value);
                    }
                }
                tempFormData = formData;
                tempFormData.offer = {
                    values: inputData
                }
                setFormData(tempFormData);
                nextStep = 23;
                postData.answers = tempFormData;
                Connector.start('post',`https://apis.detroitmi.gov/property_applications/${appID}/answers/`,postData,true,props.token,(e)=>{handleAPICalls(e, 'saveForm', step, nextStep)},(e)=>{handleAPICalls(e, 'saveForm', step)});
                break;

            case 23:
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
                tempFormData.propertyUse = {
                    values: inputData
                }
                setFormData(tempFormData);
                if(formData.propertyUse.values.length > 1){
                    // come back
                    nextStep = 5;
                }else{
                    switch (formData.propertyUse.values[0][0]) {
                        case "commercial-retail":
                            nextStep = 28;
                            break;

                        case "mixed-use":
                            nextStep = 28;
                            break;

                        case "residential-multifamily":
                            nextStep = 28;
                            break;

                        case "residential-single-family":
                            nextStep = 28;
                            break;

                        case "industrial":
                            nextStep = 28;
                            break;

                        case "parking-lot-auto-related":
                            setStep(24);
                            nextStep = 24;
                            break;
                    
                        default:
                            break;
                    }
                }
                postData.answers = tempFormData;
                Connector.start('post',`https://apis.detroitmi.gov/property_applications/${appID}/answers/`,postData,true,props.token,(e)=>{handleAPICalls(e, 'saveForm', step, nextStep)},(e)=>{handleAPICalls(e, 'saveForm', step)});
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
                tempFormData.anticipadedWork = {
                    values: inputData
                }
                setFormData(tempFormData);
                nextStep = 29;
                postData.answers = tempFormData;
                Connector.start('post',`https://apis.detroitmi.gov/property_applications/${appID}/answers/`,postData,true,props.token,(e)=>{handleAPICalls(e, 'saveForm', step, nextStep)},(e)=>{handleAPICalls(e, 'saveForm', step)});
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

            case 29:
                for (let index = 0; index < e.target.elements.length; index++) {
                    if(e.target.elements[index].tagName == 'TEXTAREA'){
                        inputData.push(e.target.elements[index].value);
                    }
                }
                tempFormData = formData;
                tempFormData.proposal = {
                    values: inputData
                }
                setFormData(tempFormData);
                nextStep = 30;
                postData.answers = tempFormData;
                Connector.start('post',`https://apis.detroitmi.gov/property_applications/${appID}/answers/`,postData,true,props.token,(e)=>{handleAPICalls(e, 'saveForm', step, nextStep)},(e)=>{handleAPICalls(e, 'saveForm', step)});
                break;

            case 30:
                tempFormData = formData;
                tempFormData.propozedZoning = {
                    values: btnState
                }
                setFormData(tempFormData);
                nextStep = 31;
                postData.answers = tempFormData;
                Connector.start('post',`https://apis.detroitmi.gov/property_applications/${appID}/answers/`,postData,true,props.token,(e)=>{handleAPICalls(e, 'saveForm', step, nextStep)},(e)=>{handleAPICalls(e, 'saveForm', step)});
                break;

            case 31:
                for (let index = 0; index < e.target.elements.length; index++) {
                    if(e.target.elements[index].tagName == 'INPUT' || e.target.elements[index].tagName == 'SELECT'){
                        inputData.push(e.target.elements[index].value);
                    }
                }
                tempFormData = formData;
                tempFormData.costTimelineFunding = {
                    values: inputData
                }
                setFormData(tempFormData);
                nextStep = 32;
                postData.answers = tempFormData;
                Connector.start('post',`https://apis.detroitmi.gov/property_applications/${appID}/answers/`,postData,true,props.token,(e)=>{handleAPICalls(e, 'saveForm', step, nextStep)},(e)=>{handleAPICalls(e, 'saveForm', step)});
                break;

            case 32:
                
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

import React, { useState }from 'react';
import './Geocoder.scss';

function Geocoder(props) {
  // Declare a new state variable, which we'll call when changing panel render
  const [sugg, setSugg]       = useState();
  const [address, setAddress] = useState();
  const [parcel, setParcel]   = useState(props.parcel);

  const getAddressSuggestions = (addr) => {
    let url = `https://opengis.detroitmi.gov/opengis/rest/services/BaseUnits/BaseUnitGeocoder/GeocodeServer/findAddressCandidates?Address=&Address2=&Address3=&Neighborhood=&City=&Subregion=&Region=&Postal=&PostalExt=&CountryCode=&SingleLine=${addr}&outFields=*&maxLocations=&matchOutOfRange=true&langCode=&locationType=&sourceCountry=&category=&location=&distance=&searchExtent=&outSR=&magicKey=&f=json`;
    
    try {
        fetch(url)
        .then((resp) => resp.json()) // Transform the data into json
        .then(function(data) {
          let candidates = [];
          if(data.candidates.length){
            candidates = data.candidates;
          }
          setSugg(candidates);
        })
        .catch((error) => {
          console.log(error);
        });
    }catch (error) {
        console.log(error);
    }
  }

  const addressPlitter = (addr) => {
    let tempAddr = addr.split(",");
    tempAddr = tempAddr[0];
    tempAddr = tempAddr.split(" ");
    let newTempAddr = '';
    let size = tempAddr.length;
    tempAddr.forEach(function(item, index) {
      newTempAddr += item;
      ((index < size) && (index + 1) !== size) ? newTempAddr += '+': 0;
    });
    return newTempAddr;
  }

  const handleChange = (ev) => {
    if(ev.target.value == ''){
      setAddress('')
    }else{
      getAddressSuggestions(ev.target.value);
      setAddress(ev.target.value)
    }
  }

  const handleKeyDown = (ev) => {
    if(ev.keyCode == 13){
      ev.preventDefault();
      if(parcel == ''){
        findParcelID();
      }
    }
  }

  const handleBlur = (ev) => {
    if(ev.target.value == ''){
      setAddress('');
      setParcel('');
    }else{
      if(parcel == ''){
        findParcelID();
      } 
    }
  }

  const findParcelID = () => {
    let url = `https://opengis.detroitmi.gov/opengis/rest/services/BaseUnits/BaseUnitGeocoder/GeocodeServer/findAddressCandidates?Address=&Address2=&Address3=&Neighborhood=&City=&Subregion=&Region=&Postal=&PostalExt=&CountryCode=&SingleLine=${addressPlitter(address)}&outFields=*&maxLocations=&matchOutOfRange=true&langCode=&locationType=&sourceCountry=&category=&location=&distance=&searchExtent=&outSR=&magicKey=&f=json`;
    try {
        fetch(url)
        .then((resp) => resp.json()) // Transform the data into json
        .then(function(data) {
          if(data.candidates.length && data.candidates[0].attributes.parcel_id != ''){
            setParcel(data.candidates[0].attributes.parcel_id);
          }
          console.log(parcel);
        })
        .catch((error) => {
          console.log(error);
        });
    }catch (error) {
        console.log(error);
    }
  }

  const buildOptions = () => {
    let markup = sugg.map((item, key) =>
        <option key={key} value={item.attributes.StAddr}></option>
    );
    return markup;
  }

  const buildNames = () => {
    return `${props.id}-list`;
  }

  const getClassName = () => {
    if(props.required){
      return 'required-field';
    }else{
      return '';
    }
  }

  return (
      <div>
        <label className={getClassName()} htmlFor={props.id}>{props.label}</label>
        <input list={buildNames()} id={props.id} aria-label={props.label} name={props.name} value={props.value} defaultValue={props.savedValue} placeholder={props.placeholder} data-parcel={parcel} onKeyDown={handleKeyDown} onChange={handleChange} onBlur={handleBlur} aria-required={props.required} required={props.required} autoComplete="off"></input>
        <datalist id={buildNames()}>
            {(sugg) ? buildOptions() : ''}
        </datalist>
        <div className={(props.alert) ? 'active-m' : 'hide-m'}>
            {(props.alert) ? props.alert : ''}
        </div>
      </div>
  );
}

export default Geocoder;

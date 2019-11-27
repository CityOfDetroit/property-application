import React from 'react';
import ReactDOM from 'react-dom';
import './App.scss';
import Card from '../Card/Card';
import data from '../../data/App.steps.json';

class App extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            step : 0 
        };
    }

    componentDidMount() {
        
    }
  
    componentWillUnmount() {
  
    }

    buildContent(){
        const markup = data.steps[this.state.step].items.cards.map((card) =>
            <Card key={card.toString()} type={card.type} title={card.title.value} titleType={card.title.type} body={card.body.markup} bodyType={card.body.type}></Card>
        );
        return markup;
    }
  
    updateStep(e){
        let newState = this.setState.step;
        if(e){
            newState++;
        }else{
            newState--;
        }
        this.setState({
            step : newState
        });
    }

    render(){
        return(
            this.buildContent()
        )
    }
}

export default App;


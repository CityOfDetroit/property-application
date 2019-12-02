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
        this.updateStep = this.updateStep.bind(this);
    }

    componentDidMount() {
        
    }
  
    componentWillUnmount() {
  
    }

    buildContent(){
        const markup = this.buildCards(data.steps[this.state.step].items);
        return markup;
    }

    buildCards(items){
        const markup = items.cards.map((card) =>
            <Card  
                key={card.toString()} 
                type={card.type} 
                title={card.title.value} 
                titleType={card.title.type} 
                body={card.body.markup} 
                bodyType={card.button.type}
                button={card.button.text} 
                buttonType={card.body.type}
                forms={items.forms}
                onStateChange={this.updateStep}>
            </Card>
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


import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import Card from './components/Card/Card';

class App extends React.Component{
    render(){
        return(
            <Card title="Property Application Form"></Card>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('app'))
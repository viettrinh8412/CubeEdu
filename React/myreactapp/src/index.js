import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import Class from './screen/Class'
import Customer from './screen/Customer'
import Teacher from './screen/Teacher'

//ReactDOM.render(<App />, document.getElementById('root'));
var RComponent = window.RComponent ? window.RComponent : "noooo";

if (RComponent == "Class") {
    ReactDOM.render( < Class / > , document.getElementById('root'));
}
if (RComponent == "Customer") {
    ReactDOM.render( < Customer / > , document.getElementById('root'));
}
if (RComponent == "Teacher") {
    ReactDOM.render( < Teacher / > , document.getElementById('root'));
}



// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

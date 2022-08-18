import React from 'react';
import ReactDOM from 'react-dom';
// import App from './app/layout/App';
import 'react-calendar/dist/Calendar.css';
import 'react-toastify/dist/ReactToastify.min.css';
import 'react-datepicker/dist/react-datepicker.css';
import './sass/main.scss';
// import reportWebVitals from './reportWebVitals';
// import { store, StoreContext } from './app/stores/store';
// import ScrollToTop from './app/layout/ScrollToTop';
import 'react-toastify/dist/ReactToastify.css';
import { store, StoreContext } from './app/stores/store';
import App from './app/layout/App';

ReactDOM.render(
    <StoreContext.Provider value={store}>
        <App />
    </StoreContext.Provider>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();

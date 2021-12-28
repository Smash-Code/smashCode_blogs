import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.jsx';
import { Provider } from "react-redux";
import store from "./store";
import AuthContextProvider from "./context/AuthContext";
import DataContextProvider from "./context/DataContext";

ReactDOM.render(
    <Provider store={store}>
        <AuthContextProvider>
      
        <DataContextProvider>
            <App />
        </DataContextProvider>
        </AuthContextProvider>
    </Provider>
, document.getElementById('root'));

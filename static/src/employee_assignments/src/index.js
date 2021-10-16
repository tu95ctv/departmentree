import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import App from "./App";
import ErrorBoundary from './ErrorBoundary'
import { OdooProvider } from './contexts/odoo'
import 'primereact/resources/themes/mdc-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import './TreeTable.css'

const Main = () => {
    return (
        <ErrorBoundary fallback={<h2>There is error.</h2>}>
            <Suspense fallback={<h1>Loading...</h1>}>
                <App  />
            </Suspense>
        </ErrorBoundary>
    )
}
const Root = () => {
    const value = { 
        odoo_params: window.react_params, 
        action_manager: window.action_manager 
    }
    return (
        <OdooProvider value={value}><Main /></OdooProvider>
    )
}
ReactDOM.render(<Root />, document.getElementById("root"));

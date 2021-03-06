import React from 'react';
import ReactDOM from 'react-dom';
import { ToastContainer } from 'react-toastify';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import App from './pages/App';
import { ApplicationProvider } from './context'

import './styles/globals.css'
import 'react-toastify/dist/ReactToastify.min.css';

ReactDOM.render(
  <React.StrictMode>
    <DndProvider backend={HTML5Backend}>
      <ApplicationProvider>
        <App />
        <ToastContainer/>
      </ApplicationProvider>
    </DndProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

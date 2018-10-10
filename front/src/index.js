import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import MenuAppBar from './menuAppBar/MenuAppBar';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import registerServiceWorker from './registerServiceWorker';

/*const Main = () => (
    <MuiThemeProvider>
    <MenuAppBar />
    <App />
    </MuiThemeProvider>
  );*/

  const Main = () =>(
    <MuiThemeProvider>
    <MenuAppBar />
    </MuiThemeProvider>  
    
  );



ReactDOM.render(<Main />, document.getElementById('root'));
registerServiceWorker();

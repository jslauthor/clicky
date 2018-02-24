import * as React from 'react';
import * as ReactDOM from 'react-dom';

import Router from './router';

const render = (Component) => {
  ReactDOM.render(
    <Component />,
    document.getElementById('parcel-root')
  );
};

render(Router);

declare const window: any;
window.ipcRenderer.on('play', (event, message) => {
  console.log(event, message);
  const audio = new Audio(message);
  audio.play();
});
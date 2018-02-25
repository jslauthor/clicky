import * as React from 'react';
import * as ReactDOM from 'react-dom';

const random = (min, max) => Math.floor(Math.random()*(max-min+1)+min);

declare const window: any;
window.ipcRenderer.on('play', (event, message) => {
  const audio = new Audio(message);
  audio.volume = random(40, 80) / 100;
  audio.play();
});

// import Router from './router';

// const render = (Component) => {
//   ReactDOM.render(
//     <Component />,
//     document.getElementById('parcel-root')
//   );
// };

// render(Router);
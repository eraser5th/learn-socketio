import React from 'react';
import './App.css';
import Chat from './Chat';

const App: React.VFC = () => (
  <div className="App">
    <Chat name={Math.random() < 0.5 ? 'eraser' : 'mayamito'} />
  </div>
);

export default App;

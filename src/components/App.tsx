import React from 'react';
import NavBar from './NavBar';

interface AppProps {
}

interface AppState {
}

class App extends React.Component<AppProps, AppState> {
  render() {
    return (
      <div id="app">
        <NavBar />
      </div>
    );
  }
}

export default App;

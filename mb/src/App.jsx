import React, { useState } from 'react';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import './App.css';

function App() {

  const [page, setPage] = useState('Home');

  return (
    <div className="app">
      <a class="skip-to-content" href="#main">Skip to content</a>
      <Header setPage={setPage} />
      <Main page={page} setPage={setPage} />
      <Footer />
    </div>
  );
}

export default App;
import React from "react";
import Home from './Home';
import About from './About';
import Vehicle from './Vehicle';
import Career from './Career';
import './Main.css';

function Main({ page, setPage }) {

    return (
        <main>
            {(page === 'Home') && <Home setPage={setPage} />}
            {(page === 'About') && <About />}
            {(page === 'Vehicle') && <Vehicle />}
            {(page === 'Career') && <Career />}
        </main>
    );
}

export default Main;
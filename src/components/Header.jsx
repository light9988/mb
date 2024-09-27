import React from 'react';
import GlobalNav from './GlobalNav';
import './Header.css';

function Header({ setPage }) {
    const handleLogoClick = () => {
        console.log('Logo clicked');
        setPage('Home');
    }

    return (
        <header className='header'>
            <img className="header-logo"
                src="https://images.unsplash.com/photo-1629753883864-565512de7fe4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
                alt="Mercedes-Benz logo"
                onClick={handleLogoClick} />
            <h1 className="header-title"> Mercedes-Benz Group</h1>
            <GlobalNav className="header-nav" setPage={setPage} />
        </header>
    );
}

export default Header;

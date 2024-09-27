import React, { useState } from 'react';
import './Home.css';
import HomeCarousel from './HomeCarousel';

function Home() {
    const [page] = useState('home');

    return (
        <main className="main" id="main">
            <div className="cards">
                <div className="panel-card">
                    <h2 className="panel-card-title">Make This Year Electric  </h2>
                    <img className="panel-card-img" src="https://images.unsplash.com/photo-1616789916437-bbf724d10dae?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80" alt="Mercedes-Benz car" />
                </div>
                <div className="panel-card">
                    <h2 className="panel-card-title">Awaken the Legend</h2>
                    <img className="panel-card-img" src="https://images.unsplash.com/photo-1485291571150-772bcfc10da5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1528&q=80" alt="Mercedes-Benz car" />
                </div>
                <div className="panel-card" >
                    <h2 className="panel-card-title">Discover Mercedes-Benz</h2>
                    {/* <HomeCarousel/> */}
                    <img className="panel-card-img" src="https://images.unsplash.com/photo-1616789682173-1f1700675453?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80" alt="Mercedes-Benz car" />
                </div>
            </div>
        </main>
    );
};

export default Home;
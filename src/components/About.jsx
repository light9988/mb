import React from 'react';
import './About.css';

function About() {
    return (
        <main className="main" id="main">
            <div className="cards">
                <div className="panel-card" id="about-card1">
                    <img className="panel-card-img" src="https://images.unsplash.com/photo-1559511206-f5ade67b8484?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1473&q=80" alt="Mercedes-Benz car" />
                    <h2 className="panel-card-title">About Us </h2>
                    <p>At Mercedes-Benz World, our employees and communities are at the heart of everything we do. </p>
                </div>
                <div className="panel-card" id="about-card2">
                    <h2 className="panel-card-title">Quick Facts </h2>
                    <p>For nearly a century, Mercedes-Benz has made it our mission to move the world. Through our employees and their achievements, we’ve created a company we can all be proud of. </p>
                    <div className="about-subcard">
                        <h3>94</h3>
                        <h3>Years</h3>
                        <p>Mercedes-Benz was founded in 1926 by Karl Benz, Gottlieb Daimler, Wilhelm Maybach and Emil Jellinek, whose daughter Mercedes is our original namesake.</p>
                    </div>
                    <div className="about-subcard">
                        <h3>93</h3>
                        <h3>Locations</h3>
                        <p>With offices in 93 locations worldwide and a corporate headquarters in Stuttgart, Germany, our global presence continues to grow.</p>
                    </div>
                    <div className="about-subcard">
                        <h3>5</h3>
                        <h3>Continents</h3>
                        <p>Our vehicles are manufactured in 17 countries on five continents, and distributed all over the world.</p>
                    </div>
                    <div className="about-subcard">
                        <h3>6</h3>
                        <h3>Firsts</h3>
                        <p>From the crumple zone in 1959 to the airbag in 1980 and PRE-SAFE® braking in 2002, Mercedes-Benz has invented many of the automotive technologies we see today.</p>
                    </div>
                    <div className="about-panel-card" id="about-card3">
                        <img className="panel-card-img" id="about-card3-img" src="https://images.unsplash.com/photo-1554048968-670223ca9141?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80" alt="Mercedes-Benz logo in company" />
                        <h2 className="panel-card-title">The Mercedes-Benz Group</h2>
                        <p>The Mercedes-Benz Group is one of the world's most successful automotive companies. With Mercedes-Benz Group, we are one of the leading global suppliers of premium and luxury cars and vans. Mercedes-Benz Mobility Group offers financing, leasing, car subscription and car rental, fleet management, digital services for charging and payment, insurance brokerage, as well as innovative mobility services.</p>
                    </div>
                    <img className="panel-card-img" src="https://images.unsplash.com/photo-1618863099278-75222d755814?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80" alt="Mercedes-Benz car" />
                </div >
            </div >
        </main >
    );
};

export default About;
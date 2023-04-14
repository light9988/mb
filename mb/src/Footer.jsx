import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <nav className="footer-menu">
        <ul className='footer-menu-list'>
          <li className='footer-menu-item'><a className='footer-menu-link' href="https://www.facebook.com/mercedesbenzcareers">Facebook</a></li>
          <li className='footer-menu-item'><a className='footer-menu-link' href="https://twitter.com/MercedesBenz">Twitter</a></li>
          <li className='footer-menu-item'><a className='footer-menu-link' href="https://www.youtube.com/user/mercedesbenztv">Youtube</a></li>
          <li className='footer-menu-item'><a className='footer-menu-link' href="https://www.linkedin.com/company/mercedes-benz_ag/mycompany/">LinkedIn</a></li>
        </ul>
      </nav>
    </footer>
  );
};

export default Footer;
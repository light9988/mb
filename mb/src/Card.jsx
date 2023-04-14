import React, { useRef } from 'react';
import Button from "./Button";
import Modal from './Modal';
import './Card.css';

function Card({ imageUrl, title, text }) {
    const dialogRef = useRef();

    return (
        <div className="card">
            <img className="card-img" src={imageUrl} alt={`Mercedes-Benz ${title}`} />
            <h2 className="card-title">{title}</h2>
            <p className="card-text"> {text}</p>
            <Button className="button" type="button" visual="button" id="card-link" onClick={() => dialogRef.current.showModal()}>Subscribe</Button>
            <Modal dialogRef={dialogRef} />
        </div>
    );
}

export default Card;

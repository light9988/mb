import React, { useState, useId } from "react";
import Button from "./Button";
import "./Modal.css";

function Modal({ dialogRef }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [confirmEmail, setConfirmEmail] = useState('');
    const [nameError, setNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [confirmEmailError, setConfirmEmailError] = useState('');
    const [selectedVehicle, setSelectedVehicle] = useState('');
    const [selectedModel, setSelectedModel] = useState('');
    const id = useId();
    const [submitMessage, setSubmitMessage] = useState('');
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);


    const handleVehicleChange = (event) => {
        setSelectedVehicle(event.target.value);
        setSelectedModel('');
    }

    const handleModelChange = (event) => {
        setSelectedModel(event.target.value);
    }

    const vehicleModels = {
        EVs: ["EQB SUV", "EQE Sedan", "EQE SUV", "EQS Sedan"],
        SUVs: ["GLA SUV", "GLB SUV", "GLC SUV", "GLE SUV"],
        Sedans: ["A_Class Sedan", "B_Class Sedan", "C_Class Sedan", "E_Class Sedan"],
    };

    const modelOptions =
        selectedVehicle && vehicleModels[selectedVehicle] ? (
            vehicleModels[selectedVehicle].map((model) => (
                <option key={model} value={model}>
                    {model}
                </option>
            ))
        ) : (
            <option value="">Please select</option>
        );

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        if (name === "name") {
            setName(value);
        } else if (name === "email") {
            setEmail(value);
        } else if (name === "confirmEmail") {
            setConfirmEmail(value);
        }
    };

    const validateNameInput = () => {
        if (!name) {
            setNameError("This field is required.");
            return false;
        } else {
            setNameError("");
            return true;
        }
    };

    const validateEmailInput = () => {
        if (!email) {
            setEmailError("This field is required.");
            return false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setEmailError("Please enter a valid email address including a @.");
            return false;
        } else {
            setEmailError("");
            return true;
        }
    };

    const validateConfirmEmailInput = () => {
        if (!confirmEmail) {
            setConfirmEmailError("This field is required.");
            return false;
        } else if (confirmEmail !== email) {
            setConfirmEmailError("This field must match the provided email address.");
            return false;
        } else {
            setConfirmEmailError("");
            return true;
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const isNameValid = validateNameInput();
        const isEmailValid = validateEmailInput();
        const isConfirmEmailValid = validateConfirmEmailInput();
        if (isNameValid && isEmailValid && isConfirmEmailValid) {
            console.log("Form submitted:", { name: name, email: email, confirmEmail: confirmEmail });
            setSubmitMessage(`Hi ${name}, You have submitted the data successfully!`);
            setIsSubmitDisabled(true);
        }
    };
    
        const handleClose = () => {
        dialogRef.current.close();
        setName('');
        setEmail('');
        setConfirmEmail('');
        setSelectedVehicle('');
        setSelectedModel('');
        setNameError('');
        setEmailError('');
        setConfirmEmailError('');
    };

    return (
        <>
            <dialog ref={dialogRef} className="modal">
                <h3 className="modal-title">Subscribe to the Latest News</h3>
                <form className="form" onSubmit={handleSubmit}>
                    <p className="required-field">* Required field </p>
                    <div className="register-name">
                        <label htmlFor={`${id}-name`}>Name *</label>
                        <input
                            name="name"
                            className="register-name__input"
                            id={`${id}-name`}
                            type="text"
                            value={name}
                            onChange={handleInputChange}
                            onBlur={validateNameInput}
                        />
                        {nameError && <div className="register-name__error">{nameError}</div>}
                    </div>
                    <div className="register-email">
                        <label htmlFor={`${id}-email`}>Email *</label>
                        <input
                            name="email"
                            className="register-email__input"
                            id={`${id}-email`}
                            type="text"
                            value={email}
                            onChange={handleInputChange}
                            onBlur={validateEmailInput}
                        />
                        {emailError && <div className="register-email__error">{emailError}</div>}
                    </div>
                    <div className="register-confirm">
                        <label htmlFor={`${id}-confirmEmail`}>Confirm Email *</label>
                        <input
                            name="confirmEmail"
                            className="register-confirm__input"
                            id={`${id}-confirmEmail`}
                            type="text"
                            value={confirmEmail}
                            onChange={handleInputChange}
                            onBlur={validateConfirmEmailInput}
                        />
                        {confirmEmailError && (<div className="register-confirm__error">{confirmEmailError}</div>)}
                    </div>
                    <div className="register-checkbox">
                        <label htmlFor={`${id}-subscribe`} >Do you want to subscribe?</label>
                        <input name="subscribe" className="register-checkbox__input" id={`${id}-subscribe`} type="checkbox" defaultChecked />
                    </div>
                    <div className="register-select">
                        <label htmlFor={`${id}-select-vehicle`}>Select Vehicle: <span className="required">*</span></label>
                        <select name="select-vehicle" id={`${id}-select-vehicle`} value={selectedVehicle} onChange={handleVehicleChange} required>
                            <option value="">Please select</option>
                            <option value="EVs">EVs</option>
                            <option value="SUVs">SUVs</option>
                            <option value="Sedans">Sedans</option>
                        </select>
                    </div>
                    {selectedVehicle &&
                        <div className="register-select">
                            <label htmlFor={`${id}-select-model`}>Select Model: <span className="required">*</span></label>
                            <select name="select-model" id={`${id}-select-model`} value={selectedModel} onChange={handleModelChange} required>
                                <option value="">Please select</option>
                                {modelOptions}
                            </select>
                        </div>
                    }
                    <div className="button-group">
                        <Button
                            className="button--link"
                            type="submit"
                            visual="link"
                            id="submit-Button"
                            onSubmit={handleSubmit}
                            disabled={isSubmitDisabled}
                        >
                            Submit
                        </Button>
                        <Button
                            className="button--link"
                            type="button"
                            visual="link"
                            onClick={handleClose}
                        >
                            Close
                        </Button>
                    </div>
                    {setSubmitMessage && <div className="submit-message">{submitMessage}</div>}
                </form>
            </dialog>
        </>

    );
}

export default Modal;



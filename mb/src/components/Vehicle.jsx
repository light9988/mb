import React from 'react';
import Card from './Card';
import './Vehicle.css';

function Vehicle() {

  return (
    <main className="main" id="main">
      <div className="cards">
        <Card
          imageUrl="https://images.unsplash.com/photo-1679340433182-d70fb2e83299?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
          title="A-Class Sedan"
          text="Starting at $33,950"
        />
        <Card
          imageUrl="https://images.unsplash.com/photo-1643480017192-225b905d8d68?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1577&q=80"
          title="C-Class Sedan"
          text="Starting at $44,850"
        />
        <Card
          imageUrl="https://images.unsplash.com/photo-1609326005487-361f2e1c2640?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80"
          title="E-Class Sedan"
          text="Starting at $56,750"
        />
        <Card
          imageUrl="https://images.unsplash.com/photo-1669023161442-bb13d1f2e492?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
          title="GLC SUV"
          text="Starting at $43,850"
        />
        <Card
          imageUrl="https://images.unsplash.com/photo-1551836989-b4622a17a792?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
          title="AMG"
          text="Starting at $59,900"
        />
        <Card
          imageUrl="https://images.unsplash.com/photo-1661589997089-405a6076fc18?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80"
          title="S-Class Sedan"
          text="Starting at $114,500"
        />
      </div>
    </main>
  );
};

export default Vehicle;
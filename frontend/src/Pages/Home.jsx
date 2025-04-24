import React from "react";
import battleImage from "../images/Battleship.png"; 

import "../styles/Home.css";

const Home = () => (
  <main>
    <section className="hero">
      <h2>Welcome to Battleship!</h2>
      <img src={battleImage} alt="Battleship Game" />
    </section>
  </main>
);

export default Home;

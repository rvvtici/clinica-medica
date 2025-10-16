import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./home_paciente.css";
import Header from "../header/header.jsx";
import Footer from "../footer/footer.jsx";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";

const HomePaciente = () => {
  const [email, setEmail] = useState("");

  return (
    <>
      <Header />
      <Footer />
    </>
  );
};

export default HomePaciente;

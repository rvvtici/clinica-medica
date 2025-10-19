import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./home_funcionario.css";
import Header from "../header/header.jsx";
import Footer from "../footer/footer.jsx";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";

const HomeFuncionario = () => {
  const [email, setEmail] = useState("");

  return (
    <>
      <Header />
      <Footer />
    </>
  );
};

export default HomeFuncionario;

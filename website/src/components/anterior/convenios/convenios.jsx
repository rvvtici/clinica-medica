import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./convenios.css";
import HeaderPaciente from "../header/header_paciente.jsx";
import Footer from "../footer/footer.jsx";
import { FaUser } from "react-icons/fa";

const Convenio = () => {
  const convenios = [
    { 
      id: "unimed", 
      nome: "Unimed", 
      link: "https://www.unimed.coop.br/site/" 
    },
    { 
      id: "amil", 
      nome: "Amil", 
      link: "https://institucional.amil.com.br/" 
    },
    { 
      id: "sulamerica", 
      nome: "SulAmérica", 
      link: "https://portal.sulamericaseguros.com.br/" 
    },
    { 
      id: "bradesco", 
      nome: "Bradesco Saúde", 
      link: "https://www.bradescoseguros.com.br/clientes/produtos/plano-saude" 
    },
    { 
      id: "porto", 
      nome: "Porto Seguro Saúde", 
      link: "https://www.portoseguro.com.br/porto-seguro-saude" 
    }
  ];

  return (
    <>
      <HeaderPaciente />
      <div className="page-convenios">        
        <p className="title">
          Convênios
        </p>

        <p className="content">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur scelerisque dolor sapien. Aenean volutpat est felis, non pellentesque ligula volutpat et. Nam elementum nunc at tempus vulputate. Aliquam sed quam sit amet nunc laoreet auctor. Interdum et malesuada fames ac ante ipsum primis in faucibus. Pellentesque quis purus tincidunt, luctus libero non, commodo elit. Nullam turpis libero, sodales nec malesuada sed, ultricies id sem. Vivamus non imperdiet est. Vestibulum tempor nisi eget tincidunt venenatis. Curabitur vestibulum justo odio, in suscipit libero malesuada sed.
        </p>
        <p className="content">
          Vestibulum finibus dui nec arcu porta, vitae sodales nisi feugiat. Sed tristique dignissim interdum. Integer elementum tempus tortor, id ullamcorper velit auctor eget. Aenean urna nunc, cursus sed malesuada ac, ullamcorper nec est. Suspendisse finibus, erat id pellentesque vulputate, augue nunc fermentum lectus, ac scelerisque magna lacus in ante. Mauris tempor neque orci, sed porttitor lacus luctus vel. Suspendisse vel mauris ipsum. Etiam vulputate consequat nibh ut sollicitudin.
        </p>

        <p className="content">
          A busca pode ser realizada selecionando o convênio e especialidade ou a 
          partir do nome do profissional.
        </p>
    
        <ul className="lista-convenios">
          {convenios.map((conv) => (
            <li key={conv.id}>
              <Link to={conv.link} className="link-convenio">
                {conv.nome}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Convenio;
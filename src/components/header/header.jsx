import React from "react";
import "./header.css";
import { FaHospital } from "react-icons/fa";

const Header = () =>{
    return(
        <div id="header">
            <FaHospital className="icon"></FaHospital>
            <h2>Clínica Médica</h2>
        </div>


    )
}


export default Header;
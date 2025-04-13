import { BsArrowRightSquareFill } from "react-icons/bs";
import { useEffect } from "react";
import logo from '../assets/images/logo.png';
import { useNavigate } from "react-router-dom";
import '../css/lockscreen.css';
export default function LockScreen({onUnlock}) {

  /*useEffect(() => {
    window.history.pushState({},'', '/lock-screen');
  }, ['lock-screen']);*/
    return(
      <div className="lock-screen">
        <img src={logo} alt="" srcset="" className="logo"/>
        <h1>Aymen Portofolio</h1>
        <div className="lock-screen-input">
        <input type="text" placeholder="username" id="userName"/>
        <button onClick={onUnlock}><BsArrowRightSquareFill /></button>
        </div>
        
        <p>username is : aymen</p>
      </div>
    )
  }
  
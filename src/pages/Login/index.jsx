import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
let navigate = useNavigate()
  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post(`http://192.168.3.20:8080/api/users/login?username=${username}&password=${password}`);
      localStorage.setItem("isAuthenticated", true);
      localStorage.setItem("username", username);


      navigate("/")

      console.log(response); // Handle success scenario here

    } catch (error) {
      console.error(error); // Handle error scenario here
    }
  };
  return (
    <div className=" h-screen flex justify-center items-center">
      <div className=" rounded-lg bg-white shadow w-[388px]">
        <div className="px-4 py-5 sm:p-6">
          <img src="/logo.svg" alt="" className="w-[144px] mx-auto" />
          <div className=" rounded-lg bg-white shadow flex flex-col p-5 ">
            <div className="flex justify-center mb-3">
              <img
                src="/Untitled.png"
                alt=""
                className="rounded-full w-[60px] mr-4"
              />

            </div>
               {/* Login Form */}
               <input
               className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-3"
                type="text"
                placeholder="Nom d'utilisateur"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              
              <input 
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
               required 
             />

             {/* ... */}

             {/* Submit Button */}
             <button 
               type='button'
               onClick={handleLogin}
               className= "bg-[#3F8CFF] w-[273px] rounded-2xl text-white mx-auto p-2 mt-5 text-center"
              >
               Connexion
             </button>
         
          </div>
          <p className="text-center mt-5 text-[#999999] text-sm	">
            Rhym Chatbot RH © 2024
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;

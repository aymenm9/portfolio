import { useState , useEffect} from 'react'
import Screen from './components/screen.jsx'
import ChatBot from './components/chatBot.jsx'
import './App.css'





function App() {
  const apiUrl = 'https://portfolio-chatbot-92au.onrender.com';
  console.log(apiUrl);  
  useEffect(
    ()=>{
      //This is to wake up the server from the cold start
      fetch(apiUrl).then(
        (responce)=>{
          console.log(responce.ok?'server is runing':'something go wrong')
          return responce.json()
        }
      ).then((data)=>{
        console.log(data);
      })
    },[]
  )
  return (
    <>
      <Screen />
      <ChatBot apiUrl={apiUrl}/>

    </>
  )
}

export default App

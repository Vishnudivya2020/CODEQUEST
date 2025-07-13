import React from 'react'
import './Rightsidebar.css'
import  Widget from './widget'
import Widgettag from "./widgettag"
const Rightsidebar = () => {
  return (
    <aside className="right-sidebar">
      <Widget/>
      <Widgettag/>
    </aside>
  )
}

export default Rightsidebar
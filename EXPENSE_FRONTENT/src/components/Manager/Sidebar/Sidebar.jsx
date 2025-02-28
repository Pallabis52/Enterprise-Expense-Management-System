import { useState } from 'react'
import './sidebar.css'
// import assets from '.assets/dashboard.png';
export default function Sidebar(){

    const [isExpended,setExpendedState]=useState(false);

    const menuItems=[
        
        {text:"Dashboard",
          icon:"./img/dashboard-interface.png",
        
        },

        {text:"About",
            icon:"./img/info.png"
        
        },

        {text:"Services",
          icon:"./img/google-docs.png"
        
        },

        {text:"Priciing",
        icon:"./img/dollar.png"
        
        },

        {text:"Contact",
            icon:"./img/mobile.png"
        
        }

    
    ];



    return(
        <>
        
        <section>
            <div className="main_bar">
            <div className="sidebar">
                
                <DashboardLayoutBranding/>

                


            </div>
            </div>




        </section>
        </>
    )
}
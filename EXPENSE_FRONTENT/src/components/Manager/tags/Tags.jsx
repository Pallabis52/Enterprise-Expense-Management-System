import { useState } from 'react'
import style from './tags.module.css'

export default function Tags(){

    let [tags,setTags]=useState([

    "budgeting", "expenses", "finance", "tracking", "savings", "reports", "analytics", "transactions"


    ])

  return(
    <>
  

      
       <div className={style.tag_bar}>

        {

            tags.map((tag)=>{

                return <p className={style.tags}>{tag}</p>
            })
        }

     



       </div>

    
    </>
  )

}
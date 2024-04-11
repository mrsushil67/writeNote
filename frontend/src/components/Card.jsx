import React, { useEffect, useState } from 'react'
import '../App.css'

import { FaEye } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";
import axios from 'axios';
import { Link } from 'react-router-dom'


//data come from parent component that get each and every note data
function Card({data}) {

  //catch category data
  const [category,setCategory]=useState([])

  //when component mount get the category of this card
  useEffect(()=>{
      axios
      .get(`http://localhost:3030/category/${data.category}`)
      .then((res)=>{
          setCategory(res.data)
          console.log(category)
      })
      .catch((err)=>{
          console.log(err)
      })
  },[])
  
  
  return (
    <div key={data._id} className='w-[21.4rem] md:w-[18rem] lg:w-[22rem] h-[11rem] bg-slate-200 rounded-2xl p-3 flex flex-col justify-between mt-4'>
      <div className='flex justify-end'>
        <div className='border-[1px] border-slate-400 text-slate-600 text-[10px] font-semibold px-2 rounded-full'>{category.name}</div>
      </div>
        <div className='text-[1.1rem] font-bold'>{data.title}</div>
        <div className='div-text'>{data.content}
        </div>
        <div className='flex justify-between items-end'>
      <div className={`p-2 w-[5rem] h-3 rounded-s-lg rounded-sm `} style={{backgroundColor:data.color}}></div>
        <div className='flex gap-3 justify-end'>

          {/* button for view note */}
            <Link to={`/viewnote/${data._id}`}><div className='p-2 bg-green-300 rounded-full'><FaEye/></div>   </Link>
          {/* button for update note */}
            <Link to={`/updatenote/${data._id}`}><div className='p-2 bg-orange-300 rounded-full'><FiEdit/></div>  </Link>
          {/* button for temperery note */}
            <Link to={`/deletednote/${data._id}`}><div className='p-2 bg-red-300 rounded-full'><MdDeleteOutline/></div></Link>
        </div>
        </div>
    </div>
  )
}

export default Card
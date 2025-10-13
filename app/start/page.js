'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/navbar'
import PdfDropzone from '../components/dropzone';
import Inputquery from '../components/inputquery'
import { Button } from "../../components/ui/button"
const start = () => {
  
  return (
    <div>
      <Navbar />
      <div className='flex flex-col justify-center items-center gap-2 '>
        <div className=' h-[40px] text-[14px] w-[15%] font-[Arial] bg-black border border-[#ff6600] flex justify-center items-center rounded-3xl shadow-[0_0_20px_#ff6600] transition-all duration-300'>
          ✨ AI powered content creation
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5 }}
        >
          <h1 className='text-[48px] w-[80vw] mt-[20px] font-bebas font-bold word-wrap text-center  text-transparent bg-clip-text bg-gradient-to-t from-black via-[#d03902] to-[#d03902] '>Why just read when you could be talking to me?</h1>
          <p className='text-center text-[18px] mt-[10px] font-[Arial]'>Flashcards, summaries, and smart chat at your fingertips.</p>
        </motion.div>
        <div className='flex mt-[10px]'>
          <div className='bg-white h-[0.1px] w-[20vw] mt-[23px]'></div>
          <div className='mt-[10px] ml-[8px] mr-[8px]'>Upload PDF</div>
          <div className='bg-white h-[0.1px] w-[20vw] mt-[23px]'></div>
        </div>
        <div>
          <PdfDropzone/>

        </div>
        

      </div>
    </div>
  )
}

export default start

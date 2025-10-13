'use client'
import React from 'react'
import Link from 'next/link'
import { useSession, signIn, signOut } from "next-auth/react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu'


function Navbar() {
  const { data: session } = useSession();

  return (
    <>
      <div className=' relative flex justify-between p-8 z-10 '>
        <div>
          <Link href="/">
            <h1 className='font-bebas  font-bold text-[30px]'>ALETHEA</h1>
          </Link>
        </div>
        <div>
          {session ? (
            <div className='bg-black text-[14px] w-auto p-5 text-white border-2 border-[#ff6600]  h-[40px] font-bold w-[180px] rounded-3xl shadow-[0_0_20px_#ff6600] transition-all duration-300 cursor-pointer flex items-center justify-center'>
              <DropdownMenu >
                <DropdownMenuTrigger className="border    border-black">{`Welcome ${session.user.name}`}</DropdownMenuTrigger>
                <DropdownMenuContent className="m-[17%] w-[30px] bg-black border-[#ff6600]">
                  <button onClick={() => { signOut() }} className='bg-black'>
                  <DropdownMenuLabel className="bg-black text-white border border-black cursor-pointer  ">Sign out</DropdownMenuLabel>
                  </button>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>


          ) : (
            <Link href="/login">
              <button className='bg-black text-[14px] text-white border-2 border-[#ff6600] shadow-glow-orange h-[40px] font-bold w-[80px] rounded-3xl shadow-[0_0_20px_#ff6600] transition-all duration-300 cursor-pointer'>
                Sign in
              </button>
            </Link>
          )}
        </div>
      </div>
    </>
  )
}

export default Navbar

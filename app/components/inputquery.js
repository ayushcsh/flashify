'use client'
import React, { useEffect, useRef, useState } from 'react'
import { Input } from "../../components/ui/input"
import { Button } from "../../components/ui/button"
import { ArrowUpIcon, Loader2 } from "lucide-react"
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../components/ui/carousel"

const InputQuery = () => {
  const [input, setInput] = useState('')
  const [chat, setChat] = useState([])
  const scrollRef = useRef(null)

  const handlesend = async () => {
    const userquery = input
    setInput('')

    const newMessage = { query: userquery, answer: "loading", isLoading: true }
    setChat(prev => [...prev, newMessage])

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL_backend}/chat?message=${userquery}`)
      const data = await res.json()

      setChat(prev =>
        prev.map((msg, idx) =>
          idx === prev.length - 1
            ? { ...msg, answer: data.message, isLoading: false }
            : msg
        )
      )
    } catch (error) {
      setChat(prev => [...prev, { query: userquery, answer: 'Error fetching AI response. Try Again', isLoading: false }])
    }
  }

  const handleSummary = async () => {
    const filename = localStorage.getItem("pdfFilename");
    if (!filename) {
      console.error("No filename found in localStorage")
      return
    }

    // Show "loading" message in chat
    const newMessage = { query: "Summarize PDF", answer: "loading", isLoading: true }
    setChat(prev => [...prev, newMessage])

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL_backend}/summary?file=${encodeURIComponent(filename)}`)
      const data = await res.json()

      setChat(prev =>
        prev.map((msg, idx) =>
          idx === prev.length - 1
            ? { ...msg, answer: data.summary, isLoading: false }
            : msg
        )
      )
    } catch (error) {
      setChat(prev => [...prev, { query: "Summarize PDF", answer: 'Error fetching summary. Try Again', isLoading: false }])
    }
  }

  const handleFlashcards = async () => {
    const filename = localStorage.getItem("pdfFilename");

    const newMessage = { query: "Generate Flashcards", answer: "loading", isLoading: true, type: "flashcards" }
    setChat(prev => [...prev, newMessage])
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL_backend}/flashcards?file=${encodeURIComponent(filename)}`)
      const data = await res.json()

      console.log("flashcards data:", data)

      // Instead of replacing answer with string,
      // replace with flashcards array
      setChat(prev =>
        prev.map((msg, idx) =>
          idx === prev.length - 1
            ? { ...msg, answer: data.flashcards, isLoading: false, type: "flashcards" }
            : msg
        )
      )
    } catch (error) {
      setChat(prev => [
        ...prev,
        { query: "Generate Flashcards", answer: 'Error fetching flashcards.', isLoading: false, type: "error" }
      ])
    }

  }
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handlesend()
    }
  }

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chat]);



  return (
    <div>

      <div
        ref={scrollRef}
        className="h-[73vh] w-[57vw] mb-[130px] ml-[10px] custom-scrollbar overflow-y-auto scrollbar-thin  scrollbar-thumb-gray-600 scrollbar-track-white"
      >
        {chat.length === 0 && (
          <div className='flex items-center justify-center h-full'>
            <p className='text-[24px] text-center gap-1 bg-gradient-to-r from-amber-300 via-orange-500 to-red-600
 bg-clip-text text-transparent '>No messages yet… but I’d like to read yours ✨❤️.</p>
          </div>
        )}
        {chat.map((item, index) => (
          <div key={index} className='flex flex-col mt-[20px]'>
            <div className='relative self-end bg-white h-auto max-w-[40%] rounded-[10px] right-7 p-2 font-[Arial]'>
              <p className='text-black'>{item.query}</p>
            </div>

            <div className='relative  h-auto max-w-[76%] w-fit rounded-[15px] p-2 font-[Arial] mt-[20px]'>
              {item.isLoading ? (
                <div className='flex items-center gap-2'>
                  <Loader2 className='h-6 bg-[#262626] w-6 rounded-2xl animate-spin text-white ' />
                </div>
              ) : item.type === "flashcards" ? (
                <div className="w-full max-w-2xl mx-auto mt-[10px]">
                  <Carousel
                    className=" w-[53vw] "
                    opts={{
                      align: "start",
                      loop: true,
                    }}
                  >
                    <CarouselContent className="-ml-1">
                      {item.answer?.map((card, i) => (
                        <CarouselItem key={i} className="pl-4 md:basis-1/2 lg:basis-1/3">
                          <div className="group relative h-64 [transform-style:preserve-3d] transition-transform duration-500 hover:rotate-y-180">
                            {/* Front of Card */}
                            <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-primary p-6 shadow-md backface-hidden [backface-visibility:hidden] group-hover:opacity-0 transition-opacity duration-300">
                              <div className="text-center">
                                <p className="text-primary-foreground">Question {i + 1}</p>
                                <p className="mt-2 text-[17px] font-[Arial] text-white">{card.question}</p>

                              </div>
                            </div>

                            {/* Back of Card */}
                            <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-white p-6 shadow-md backface-hidden [backface-visibility:hidden] [transform:rotateY(180deg)] group-hover:opacity-100 opacity-0 transition-opacity duration-300">
                              <div className="text-center">
                                <p className="text-sm font-medium text-gray-500">Answer</p>
                                <p className="mt-2 text-[17px] font-[Arial] text-gray-900">{card.answer}</p>
                              </div>
                            </div>
                          </div>
                        </CarouselItem>

                      ))}
                    </CarouselContent>
                    <div className="mt-4 flex justify-center gap-2">
                      <CarouselPrevious className="static translate-x-0 translate-y-0 relative left-0 right-0" />
                      <CarouselNext className="static translate-x-0 translate-y-0 relative left-0 right-0" />
                    </div>
                  </Carousel>
                </div>
              ) : (
                <p className='text-white bg-[#262626] relative  h-auto  rounded-[15px] p-2 font-[Arial] mt-[20px]'>{item.answer}</p>
              )}
            </div>

          </div>
        ))}
      </div>


      <div className='flex gap-3 fixed bottom-30 mr-[25px] right-0'>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.5 }}>
          <Link href="/start">
            <Button className="bg-gradient-to-t from-[#3f1f13] via-[#d03902] to-[#d03902] text-white font-semibold rounded-lg px-4 py-2 shadow-md cursor-pointer">
              Upload New PDF
            </Button>
          </Link>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.5 }}>
          <Button onClick={handleSummary} className="bg-gradient-to-t from-[#3d1e12] via-[#d03902] to-[#d03902] text-white font-semibold rounded-lg px-4 py-2 shadow-md cursor-pointer">
            Summarize
          </Button>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.5 }}>
          <Button onClick={handleFlashcards} className="bg-gradient-to-t from-[#3f1f13] via-[#d03902] to-[#d03902] text-white font-semibold rounded-lg px-4 py-2 shadow-md cursor-pointer">
            Generate Q&A flashcards
          </Button>
        </motion.div>
      </div>

      <div className='fixed flex bottom-12 left-160'>
        <div className='flex '>
          <Input
            className='w-[57vw] border-[#131313] font-[Arial] bg-[#131313] rounded-[10px] h-[50px]'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type here and press Enter"
          />
          <Button
            onClick={handlesend}
            disabled={!input}
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full hover:bg-white bg-white disabled:bg-[#434242]"
          >
            <ArrowUpIcon className={`h-4 w-4 ${input ? "text-black" : "text-gray-400"}`} />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default InputQuery

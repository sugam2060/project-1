'use client'

import { useEffect, useRef } from 'react'

export const useOutsideClick = <T extends HTMLElement>(callback: () => void) => {
    const ref = useRef<T>(null)
    useEffect(()=>{
        const handleOutSideClick = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                callback()
            }
        }

        document.addEventListener('mousedown', handleOutSideClick)
        return () => {
            document.removeEventListener('mousedown', handleOutSideClick)
        }
    },[callback])

    return ref
}
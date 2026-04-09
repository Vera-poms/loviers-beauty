"use client"

import { ChakraProvider, defaultSystem } from "@chakra-ui/react"
import {
  ColorModeProvider,
  type ColorModeProviderProps,
} from "./color-mode"
import { useState, useEffect } from "react"

export function Provider(props: ColorModeProviderProps) {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  
  return (
    <ChakraProvider value={defaultSystem}>
      <ColorModeProvider {...props} >
      <div style={{ opacity: hasMounted ? 1 : 0, transition: 'opacity 0.1s' }}>{props.children}
        </div>

      </ColorModeProvider>
    </ChakraProvider>
  )
}

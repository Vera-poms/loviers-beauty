'use client'

import {createContext, useContext, useState, ReactNode, useCallback} from 'react'
import { Box, Text } from '@chakra-ui/react';

type ErrorType = "error" | "success"
interface ErrorMessageProps {
  text: string
  type: ErrorType
}

interface ErrorContextType {
  showMessage: (text: string, type: ErrorType) => void
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined)

export const ErrorMessage = ({ children }: { children: ReactNode }) => {
    const [statusMessage, setStatusMessage] = useState<ErrorMessageProps | null>(null)

    const showMessage = useCallback((text: string, type: ErrorType) => {
        setStatusMessage({ text, type });
        setTimeout(() => setStatusMessage(null), 5000);
    }, []);
  return (
    <ErrorContext.Provider value={{showMessage}}>
        {children}

        {statusMessage && (
            <Box
            w="78"
            p="3"
            borderRadius="md"
            bg={statusMessage.type === "error" ? "red.50" : "green.50"}
            borderWidth="1px"
            borderColor={statusMessage.type === "error" ? "red.200" : "green.200"}>
                <Text
                color={statusMessage.type === "error" ? "red.600" : "green.600"}
                fontSize="sm"
                textAlign="center">
                    {statusMessage.text}
                </Text>
            </Box>
        )}
    </ErrorContext.Provider>
  )
}

export const useStatus = () => {
  const context = useContext(ErrorContext)
  if (!context) {
    return { showMessage: () => {} } as ErrorContextType
  }
  return context
}
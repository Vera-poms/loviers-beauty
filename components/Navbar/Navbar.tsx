import React from 'react'
import {Box, Flex, Text, IconButton} from "@chakra-ui/react"

const Navbar = () => {
  return (
    <Box 
    as="nav" 
    position="sticky" 
    top="0" 
    zIndex="sticky" >
        <Flex 
        justify="space-between" 
        align="center" 
        h="48px" 
        px="2">
            <Text>Loviers</Text>
        </Flex>
    </Box>
  )
}

export default Navbar
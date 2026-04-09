'use client';

import { Box, Flex, Text, Image, Heading, IconButton, Carousel, SimpleGrid } from '@chakra-ui/react';
import { robotoSerif, montserrat } from '@/app/font';
import { LuChevronLeft, LuChevronRight, LuPause, LuPlay } from 'react-icons/lu';

interface Subcategory {
    id: number;
    name: string;
    image: string | null;
}

interface ServiceData {
    id: number;
    image: string | null;
    video: string | null;
    title: string;
    description: string;
    braidingHours: string;
}

interface ServiceDetailsProps {
    service: ServiceData;
    subcategories: Subcategory[];
}

const ServiceDetails = ({ service, subcategories }: ServiceDetailsProps) => {
  return (
    <Box>
        <Carousel.Root
          autoplay={{ delay: 5000 }}
          slideCount={1}
          mx="auto"
          w="100vw"
        >
          <Carousel.ItemGroup>
            <Carousel.Item index={0}>
              <Box w="100%" h="300px" bg="black" position="relative" overflow="hidden">
                {service.video ? (
                  <video
                    src={service.video}
                    autoPlay
                    muted
                    loop
                    playsInline
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                ) : service.image ? (
                  <Image
                    src={service.image}
                    alt={service.title}
                    w="100%"
                    h="100%"
                    objectFit="cover"
                  />
                ) : (
                  <Box w="100%" h="100%" bg="gray.200" />
                )}
                <Flex
                  position="absolute"
                  bottom="0"
                  left="0"
                  right="0"
                  p="4"
                  bg="blackAlpha.600"
                  direction="column"
                  gap="1"
                >
                  <Heading
                    fontSize="22px"
                    color="white"
                    fontFamily={robotoSerif.style.fontFamily}
                  >
                    {service.title}
                  </Heading>
                  <Text fontSize="12px" color="whiteAlpha.800" fontFamily={montserrat.style.fontFamily}>
                    {service.description}
                  </Text>
                </Flex>
              </Box>
            </Carousel.Item>
          </Carousel.ItemGroup>

          <Carousel.Control justifyContent="center" gap="4">
            <Carousel.PrevTrigger asChild>
              <IconButton size="xs" variant="ghost">
                <LuChevronLeft />
              </IconButton>
            </Carousel.PrevTrigger>
            <Carousel.AutoplayTrigger asChild>
              <IconButton aria-label="Toggle autoplay" size="sm" variant="ghost">
                <Carousel.AutoplayIndicator
                  paused={<LuPause />}
                  play={<LuPlay />}
                />
              </IconButton>
            </Carousel.AutoplayTrigger>
            <Carousel.NextTrigger asChild>
              <IconButton size="xs" variant="ghost">
                <LuChevronRight />
              </IconButton>
            </Carousel.NextTrigger>
          </Carousel.Control>
        </Carousel.Root>

        <Box px="4" py="4">
          <Text
            fontSize="lg"
            fontFamily={montserrat.style.fontFamily}
          >
            {service.braidingHours}
          </Text>
        </Box>

        <Box px="4" py="4">
          <Heading
            fontSize="xl"
            fontFamily={robotoSerif.style.fontFamily}
            mb="4"
          >
            Subcategories
          </Heading>
          <SimpleGrid columns={2} gap="4">
            {subcategories.map((sub) => (
              <Box
                key={sub.id}
                borderRadius="lg"
                overflow="hidden"
                boxShadow="md"
                bg="white"
                cursor="pointer"
              >
                {sub.image && (
                  <Image
                    src={sub.image}
                    alt={sub.name}
                    w="100%"
                    h="120px"
                    objectFit="cover"
                  />
                )}
                <Box p="3">
                  <Text
                    fontWeight="bold"
                    fontSize="sm"
                    fontFamily={robotoSerif.style.fontFamily}
                  >
                    {sub.name}
                  </Text>
                </Box>
              </Box>
            ))}
          </SimpleGrid>
        </Box>
    </Box>
  )
}

export default ServiceDetails
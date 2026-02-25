import { Stack } from "@chakra-ui/react";
import Display from "@/components/Display/Display";
import Services from "@/components/Services/Services";
import Footer from "@/components/Footer/Footer";


export default function Home() {
  return (
    <Stack
    position="relative"
    zIndex="10">
      <Display />

      <Services />
      <Footer />
    </Stack>
  );
}

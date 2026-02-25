import { Montserrat, Roboto_Serif } from 'next/font/google';

export const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat',
});

export const robotoSerif = Roboto_Serif({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-robotoSerif',
});
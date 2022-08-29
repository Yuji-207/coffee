import Head from 'next/head'

import { 
  Container,
  CssBaseline,
} from '@mui/material';

import BottomBar from '../sections/BottomBar';
import CardList from '../sections/CardList';


const evaluations = [
  {
    beans: 'キリマンジャロ',
    temperature: 92,
    taste: 3,
    strength: 3,
  },
  {
    beans: 'マンデリン',
    temperature: 88,
    taste: 5,
    strength: 5,
  },
  {
    beans: 'モカ・シダモ',
    temperature: 94,
    taste: 2,
    strength: 2,
  },
];


export default function Home() {
  return (
    <>
      <Head>
        <title>coffee</title>
        {/* Responsive meta tag */}
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <link rel="icon" href="/favicon.ico" />
        {/* Roboto font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
        {/* Font icons */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
      </Head>
      <CssBaseline />
      <Container sx={{py: 2}} fixed>
        <CardList evaluations={evaluations} />
      </Container>
      <BottomBar />
    </>
  )
}

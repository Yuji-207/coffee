import { useState } from 'react';

import Head from 'next/head'

import {
  Container,
  CssBaseline,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material';

import BottomBar from '../sections/BottomBar';


const items = [
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

  const [modalOpen, setModalOpen] = useState(false);

  const handleClick = () => {
    setModalOpen(!modalOpen);
  }
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
        {modalOpen ? (
          <></>
        ) : (
          <List disablePadding>
          {items.map((item, i) => (
            <>
              {i > 0 && (
                <Divider component="li" />
              )}
              <ListItem key={i} disablePadding>
                <ListItemButton component="a" href="#simple-list">
                  <ListItemText
                    primary={item.beans}
                    secondary={
                      <>
                        <Typography>温度：{item.temperature} ℃</Typography>
                        <Typography>味わい：{item.taste}</Typography>
                        <Typography>濃さ：{item.strength}</Typography>
                      </>
                    }
                  />
                </ListItemButton>
              </ListItem>
            </>
          ))}
        </List>
        )}
      </Container>
      <BottomBar open={modalOpen} onClick={handleClick} />
    </>
  )
}

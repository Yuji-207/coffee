import { useState } from 'react';

import Head from 'next/head'

import {
  Button,
  Container,
  CssBaseline,
  Divider,
  List,
  ListItem,
  ListItemButton,
  TextField,
  Typography,
} from '@mui/material';

import BottomBar from '../../sections/BottomBar';


const items = [
  {
    name: 'キリマンジャロ',
  },
  {
    name: 'マンデリン',
  },
  {
    name: 'モカ・シダモ',
  },
];


export default function Beans() {

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
          <>
            <Typography variant="h6">豆の情報を入力してください</Typography>
            <TextField
              label="豆の名前"
              variant="outlined"
              sx={{minWidth: 1, my: 3}}
            />
            <Button variant="contained" fullWidth>決定</Button>
          </>
        ) : (
          <List disablePadding>
            {items.map((item, i) => (
              <>
                {i > 0 && (
                  <Divider component="li" />
                )}
                <ListItem key={i} disablePadding>
                  <ListItemButton component="a" href="#simple-list">
                    <Typography variant="subtitle1">{item.name}</Typography>
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

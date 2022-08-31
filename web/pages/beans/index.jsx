import { Fragment, useEffect, useState } from 'react';

import Head from 'next/head'

import {
  Button,
  Container,
  CssBaseline,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  TextField,
  Typography,
} from '@mui/material';

import BottomBar from '../../sections/BottomBar';

const axios = require('axios');
axios.defaults.baseURL = 'http://127.0.0.1:8000';


export default function Beans() {

  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({});
  const [modalOpen, setModalOpen] = useState(false);

  const handleChange = event => {
    const target = event.target;
    const newValue = {...newItem};
    newValue[target.name] = target.value;
    setNewItem(newValue);
  };
  
  const handleClick = () => {
    setModalOpen(!modalOpen);
  }

  useEffect(() => {
    if (!modalOpen) {
      axios.get('/beans_list')
        .then(response => {
          setItems(response.data);
        })
        .catch(error => {
          console.log({error});
        });
    }
  }, [modalOpen])

  const handleSave = () => {
    axios.post('/beans_list', newItem)
      .then(response => {
        setModalOpen(false);
      })
      .catch(error => {
        console.log({error});
      });
  };

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
            <Typography variant="subtitle1">豆の情報を入力してください</Typography>
            <TextField
              name="name"
              label="豆の名前"
              variant="outlined"
              sx={{minWidth: 1, my: 2}}
              onChange={handleChange}
            />
            <Button
              variant="contained"
              onClick={handleSave}
              sx={{my: 3}}
              fullWidth
            >
              保存
            </Button>
          </>
        ) : (
          <List disablePadding>
            {items.map((item, i) => (
              <Fragment key={i} >
                {i > 0 && (
                  <Divider component="li" />
                )}
                <ListItem key={i} disablePadding>
                  <ListItemButton component="a" href="#simple-list">
                    <ListItemText primary={item.name} />
                  </ListItemButton>
                </ListItem>
              </Fragment>
            ))}
          </List>
        )}
      </Container>
      <BottomBar open={modalOpen} onClick={handleClick} />
    </>
  )
}

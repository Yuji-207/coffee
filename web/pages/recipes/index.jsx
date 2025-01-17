import { Fragment, useEffect, useState } from 'react';

import Head from 'next/head'

import {
  Button,
  Container,
  CssBaseline,
  Divider,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { brown, cyan } from '@mui/material/colors';

import BottomBar from '../../sections/BottomBar';
import Drawer from '../../sections/Drawer';

const axios = require('axios');
axios.defaults.baseURL = 'http://127.0.0.1:8000';


const theme = createTheme({
  palette: {
    primary: {
      main: brown[500],
    },
    secondary: {
      main: cyan[200],
    },
  },
});


export default function Recipes() {

  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({user_id: 1});
  const [beansList, setBeansList] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleChange = event => {
    const target = event.target;
    const newValue = {...newItem};
    newValue[target.name] = Number(target.value);
    setNewItem(newValue);
  };

  useEffect(() => {
    if (!modalOpen) {

      axios.get('/recipes')
        .then(recipesResponse => {
          const tmp = recipesResponse.data;
          for (let i = 0; i < tmp.length; i++) {

            axios.get('/beans_list/' + tmp[i].beans_id)
            .then(beansListResponse => {
              tmp[i]['beans'] = beansListResponse.data;
            })
            .catch(error => {
              console.log({error});
            })
            .finally(() => {
              setItems(JSON.parse(JSON.stringify(tmp)));
            });

          }
        })
        .catch(error => {
          console.log({error});
        });

    } else {

      axios.get('/beans_list')
      .then(response => {
        setBeansList(response.data);
      })
      .catch(error => {
        console.log({error});
      });

    }
  }, [modalOpen]);

  const handleSave = () => {
    axios.post(`/recipes?user_id=${newItem.user_id}&beans_id=${newItem.beans_id}`, newItem)
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
      <ThemeProvider theme={theme}>
        <Container sx={{py: 2}} fixed>
          {modalOpen ? (
            <>
              <Typography variant="subtitle1">レシピを入力してください</Typography>
              <FormControl fullWidth>
                <InputLabel id="select-label" sx={{my: 2}}>豆の名前</InputLabel>
                <Select
                  labelId="select-label"
                  label="豆の名前"
                  name="beans_id"
                  onChange={handleChange}
                  sx={{my: 2}}
                >
                  {beansList.map(beans => (
                    <MenuItem key={beans.id} value={beans.id}>
                      {beans.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                name="temperature"
                label="湯温（℃）"
                type="number"
                variant="outlined"
                sx={{minWidth: 1, my: 3}}
                onChange={handleChange}
              />
              <Button
                variant="contained"
                onClick={handleSave}
                sx={{my: 2}}
                fullWidth
              >
                保存
              </Button>
            </>
          ) : (
            <List disablePadding>
              {items.map((item, i) => (
                <Fragment key={item.id} >
                  {i > 0 && (
                    <Divider component="li" />
                  )}
                  <ListItem key={i} disablePadding>
                    <ListItemButton component="a" href="#simple-list">
                      <ListItemText
                        primary={item.beans !== undefined && item.beans.name}
                        secondary={
                          <Typography>温度：{item.temperature} ℃</Typography>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                </Fragment>
              ))}
            </List>
          )}
        </Container>
        <BottomBar
          open={modalOpen}
          onMainClick={() => {
            setModalOpen(!modalOpen);
          }}
          onMenuClick={() => {
            setDrawerOpen(!drawerOpen);
          }}
        />
        <Drawer open={drawerOpen} setOpen={setDrawerOpen} />
      </ThemeProvider>
    </>
  )
}

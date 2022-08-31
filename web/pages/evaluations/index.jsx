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


export default function Evaluations() {

  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({user_id: 1});
  const [recipes, setRecipes] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  const handleChange = event => {
    const target = event.target;
    const newValue = {...newItem};
    newValue[target.name] = Number(target.value);
    setNewItem(newValue);
  };
  
  const handleClick = () => {
    setModalOpen(!modalOpen);
  }

  useEffect(() => {
    if (!modalOpen) {

      axios.get('/evaluations')
        .then(evaluationsResponse => {
          const tmp = evaluationsResponse.data;
          for (let i = 0; i < tmp.length; i++) {

            axios.get('/recipes/' + tmp[i].recipe_id)
              .then(recipeResponse => {
                tmp[i]['recipe'] = recipeResponse.data;

                axios.get('/beans_list/' + tmp[i].recipe.beans_id)
                  .then(beansResponse => {
                    tmp[i]['recipe']['beans'] = beansResponse.data;
                  })
                  .catch(error => {
                    console.log({error});
                  })
                  .finally(() => {
                    setItems(JSON.parse(JSON.stringify(tmp)));
                  });

              })
              .catch(error => {
                console.log({error});
              });

          }
        })
        .catch(error => {
          console.log({error});
        });

    } else {

      axios.get('/recipes')
        .then(recipesResponse => {
          const tmp = recipesResponse.data;
          for (let i = 0; i < tmp.length; i++) {

            axios.get('/beans_list/' + tmp[i].beans_id)
              .then(beansResponse => {
                tmp[i]['beans'] = beansResponse.data;
              })
              .catch(error => {
                console.log({error});
              })
              .finally(() => {
                setRecipes(JSON.parse(JSON.stringify(tmp)));
              });

          }
        })
        .catch(error => {
          console.log({error});
        });

    }
  }, [modalOpen]);

  const handleSave = () => {
    axios.post(`/evaluations?user_id=${newItem.user_id}&recipe_id=${newItem.recipe_id}`, newItem)
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
              <Typography variant="subtitle1">レシピを評価してください</Typography>
              <FormControl fullWidth>
                <InputLabel id="select-label" sx={{my: 2}}>レシピ</InputLabel>
                <Select
                  labelId="select-label"
                  label="レシピ"
                  name="recipe_id"
                  onChange={handleChange}
                  sx={{my: 2}}
                >
                  {recipes.map(recipe => (
                    <MenuItem key={recipe.id} value={recipe.id}>
                      {recipe.beans !== undefined && (
                        `${recipe.beans.name}：${recipe.temperature} ℃`
                      )}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                name="taste"
                label="酸味（1） - 苦味（5）"
                type="number"
                variant="outlined"
                sx={{minWidth: 1, my: 2}}
                onChange={handleChange}
              />
              <TextField
                name="strength"
                label="濃度（1 - 5）"
                type="number"
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
                <Fragment key={item.id} >
                  {i > 0 && (
                    <Divider component="li" />
                  )}
                  <ListItem key={i} disablePadding>
                    <ListItemButton component="a" href="#simple-list">
                      <ListItemText
                        primary={item.recipe.beans !== undefined && (
                          item.recipe.beans.name
                        )}
                        secondary={
                          <>
                            <Typography>
                              温度：{item.recipe !== undefined && (
                                item.recipe.temperature
                              )} ℃
                            </Typography>
                            <Typography>味わい：{item.taste}</Typography>
                            <Typography>濃さ：{item.strength}</Typography>
                          </>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                </Fragment>
              ))}
            </List>
          )}
        </Container>
        <BottomBar open={modalOpen} onClick={handleClick} />
      </ThemeProvider>
    </>
  )
}

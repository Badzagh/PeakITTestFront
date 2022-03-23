import './App.css';
import { useState, useEffect } from "react";
import axios from 'axios';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {  Box } from '@mui/material';
import {makeRequestChange, makeRequestJokeList, makeRequestRandomJoke} from './DataFetching.js';

function App() {

  const [randomJoke, setRandomJoke] = useState([]);
  const [jokeList, setJokeList] = useState([]);
  const [showError, setShowError] = useState(false);
  let error = false;

  //
  useEffect(() => {
    //list jokes
    setTimeout(() => {
      makeRequestJokeList({setJokeList}, )
    }, 10)
  }, [jokeList])

  const handleClickAdd = (e) => {
    //check equal values
    axios({
      method: 'get',
      url: 'http://localhost:8000/items',
      headers: {
          "Content-Type": "application/json"
      }
    })
    .then((response) => {
      console.log(response.data)
      setJokeList(response.data)

      response.data.forEach((item) => {
        if(item.value === randomJoke.value){
          setShowError(true)
          error = true
        } 
      })

      if(randomJoke.value === undefined){
        setShowError(true)
        error = true
      } 

    }).then(() => {
      //////add joke
      if(!error){
        axios({
          method: 'post',
          url: 'http://localhost:8000/items/add',
          responseType: 'json',
          headers: {
              'Accept': 'application/json',
              "Content-Type": "application/json"
          },
          data : {
              value: randomJoke.value,
              created_at: randomJoke.created_at,
              updated_at: randomJoke.updated_at,
              is_deleted: "Delete",
              opacity: "1",
              text_decoration: "none"
          }
        })
        .then((response) =>  {
          console.log(response)
        })
        .then((response) =>  {
          setRandomJoke([])
        })
        .catch((error) => {
          console.log(error);
        });
      }  
    })
  }

  const handleClickGenerate = (e) => {
  
    e.preventDefault();
    //ganarate random joke
    makeRequestRandomJoke({setRandomJoke})
  }

  //Delete/Restore
  const handleClickDeleteRestore = (e) => {
    
    if(e.target.name === "Delete"){
      makeRequestChange("Restore","0.3","line-through", e.target.id)
    }
    if(e.target.name === "Restore"){
      makeRequestChange("Delete","1","none", e.target.id)
    }
  }

  //

  return (
    <div id="app">
        <Box  sx={{ maxWidth: '98%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'start',
                    marginLeft: "10px",
                    marginRight: "auto",
                    paddingTop: "100px"
                  }}> 
            <Box sx={{ maxWidth: '80%',
                    display: 'flex',
                    flexDirection: 'row',
                    marginBottom: "10px"
                  }}>
              <Button size="medium" onClick={handleClickAdd} id="button-add" type="submit">ADD</Button>
              <Button size="medium" onClick={handleClickGenerate} id="button-generate">Generate</Button>
            </Box>
            <Box minWidth={"297px"} className="container" >                                   
              <Typography>{randomJoke.value}</Typography>
              <Typography variant="caption">{randomJoke.created_at}</Typography>
            </Box>  
            {showError &&
                  <span style={{color: "red"}}>try other joke</span>
            }
        </Box>
        {jokeList.map((item, index) => (
          <Box 
            key={item._id} 
            sx={{   
              display: "flex",
              alignItems: "center",
              justifyContent: 'space-between',
              height: "125px",
              paddingBottom: "8.5px",
              paddingTop: "8.5px",
              marginBottom: "10px",
              marginLeft: "10px"
            }}>
            <Box sx={{   
                      minWidth: '280px',
                      width: '80%'
                    }}>
              <Typography style={{opacity: item.opacity, textDecoration: item.text_decoration}}>{item.value}</Typography>
              <Typography variant="caption" style={{opacity: item.opacity, textDecoration: item.text_decoration}}>{item.created_at}</Typography>
            </Box>
            <Box>
              <Button  onClick={handleClickDeleteRestore} id={item._id} className="delete-btn" value={item.updated_at} name={item.is_deleted}>{item.is_deleted}</Button>
            </Box>
          </Box>
        ))} 
    </div>
  );
}

///
export default App;

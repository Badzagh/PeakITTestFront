import './App.css';
import { useState, useEffect } from "react";
import axios from 'axios';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { Container, TextField, FormControlLabel, Box, Input } from '@mui/material';

let activePageNum = 1;
let maxPageNum = 1;

function App() {

  const [items, setItems] = useState([]);
  const [itemName, setItemName] = useState("");
  const [editItemName, setEditItemName] = useState("")
  const [visibilityEditInputContainer, setVisibilityEditInputContainer] = useState("input-edit-container-hidden");
  const [pageCount, setPageCount] = useState([]);
  const [itemId, setItemId] = useState("");
  const [page, setPage] = useState(1)
  const [taskComplete, setTaskComplete] = useState([false, false, false, false, false])
  const [txtEditButton, setTxtEditButton] = useState("Edit")
  const [txtDeleteButton, setTxtDeleteButton] = useState("Delete")

  //////////
  const [randomJoke, setRandomJoke] = useState([]);
  const [jokeList, setJokeList] = useState([]);

  //make get request
  const makeRequest = (Page) => {
    axios({
      method: 'get',
      url: `https://new-website-todo.herokuapp.com/items/choose?page=${Page}`,
      headers: {
          "Content-Type": "application/json"
        }
      })
      .then((response) => {

        response.data.Info.forEach((item, index) => {

          if(item.checkTask === "complete"){
            taskComplete[index] = true
          } else {
            taskComplete[index] = false
          }
          setTaskComplete(taskComplete)
          
        })
        setItems(response.data.Info);
      })
  } 

  //
  useEffect(() => {
    //list jokes
    setTimeout(() => {
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
      }).then(() => {
        makeRequest(1)
      })
    }, 10)
  }, [])

  // 

  const handleClickAdd = (e) => {
  
    //e.preventDefault();
    console.log(randomJoke.value)
    console.log(randomJoke.created_at)
    
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
          created_at: randomJoke.created_at
      }
    })
    .then((response) =>  {
      console.log(response)
    })
    .catch((error) => {
      console.log(error);
    });
  }

  const handleClickGanarate = (e) => {
  
    e.preventDefault();

    ///////ganarate random joke
    axios({
      method: 'get',
      url: 'https://api.chucknorris.io/jokes/random',
      headers: {
          "Content-Type": "application/json"
        }
      })
      .then((response) => {
        setRandomJoke(response.data);
        console.log(response.data)
      })
    
    //addItem(itemName.trim())
    setItemName("");
  }

  //Delete/Cancel
  const handleClickDeleteCancel = (e) => {
    if(e.target.name === "Delete"){
      axios.delete(`https://new-website-todo.herokuapp.com/items/delete/${e.target.value}`, {
        body: e.target.value
      })
      .then(() => {
        window.location.reload();
      })
    } else {
    
      setVisibilityEditInputContainer("input-edit-container-hidden")
      setTxtEditButton("Edit");
      setTxtDeleteButton("Delete");
    }
  }

  
  //

  return (
    <div>
        <Box  sx={{ maxWidth: '45%',
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    marginLeft: "auto",
                    marginRight: "auto",
                    paddingTop: "150px"
                  }}> 
            <Box minWidth={"297px"} className="input-add-container" >                                   
              <p>{randomJoke.value}</p>
              <span>{randomJoke.created_at}</span>
              <img src={randomJoke.icon_url}></img>
              <Button size="medium" onClick={handleClickAdd} id="input-button" type="submit">ADD</Button>
              <Button size="medium" onClick={handleClickGanarate} id="input-button" type="submit">Ganarate</Button>
            </Box>  
        </Box>
        
            {items.map((item, index) => (
              <Box 
                key={item._id} 
                sx={{   
                  display: "flex",
                  alignItems: "center",
                  justifyContent: 'space-between',
                  height: "25px",
                  paddingBottom: "8.5px",
                  paddingTop: "8.5px"
                }}>
                <Box>
                  <Button onClick={handleClickDeleteCancel} value={item._id} className="delete-btn" name={txtDeleteButton} >{txtDeleteButton}</Button>
                </Box>
              </Box>
            ))}
            
        
    </div>
  );
}


export default App;

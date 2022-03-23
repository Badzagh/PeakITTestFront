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
  const [showError, setShowError] = useState(false);

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
        //makeRequest(1)
      })
    }, 10)
  }, [])

  // 

  const handleClickAdd = (e) => {
  
    //e.preventDefault();
    console.log(randomJoke.value)
    console.log(randomJoke.created_at)
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
        console.log(item)
        
        if(item.value === randomJoke.value){
          console.log(item.value)
          console.log(randomJoke.value)
          console.log("equal values")
          setShowError(true)
        } else {
          setShowError(false)
        }
      })
    }).then(() => {
      //
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
      .then((response) =>  {
        setRandomJoke([])
      })
      .catch((error) => {
        console.log(error);
      });
    })
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
  }

  //Delete/Cancel
  const handleClickDeleteCancel = (e) => {
    
    console.log(e.target.value)
    setTxtDeleteButton("Restore");

    if(e.target.name === "Delete from data"){
      axios.delete(`http://localhost:8000/items/delete/${e.target.id}`, {
        body: e.target.id
      })
      .then(() => {
        setTxtDeleteButton("Restore");
        window.location.reload();
      })
    } else {
    
      setVisibilityEditInputContainer("input-edit-container-hidden")
      setTxtEditButton("Edit");
      //setTxtDeleteButton("Delete");
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
            {showError &&
                  <span>try other joke</span>
            }
        </Box>
        
            {jokeList.map((item, index) => (
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
                <p>{item.value}</p>
                <span>{item.created_at}</span>
                <Box>
                  <Button onClick={handleClickDeleteCancel} id={item._id} className="delete-btn" name={txtDeleteButton} onChange={(e) => {}}>{txtDeleteButton}</Button>
                </Box>
              </Box>
            ))}
            
        
    </div>
  );
}


export default App;

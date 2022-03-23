import axios from 'axios';
import { useState } from "react";

export const makeRequestChange = (isDeleted,opacity,textDecoration, id) => {
    axios({
        method: 'put',
        url: `https://node-js-joke-list.herokuapp.com/items/change/${id}`,
        responseType: 'json',
        data : {
            is_deleted: isDeleted,
            opacity: opacity,
            text_decoration: textDecoration
        },
        })
        .catch((error) => {
        console.log(error);
        });
}
export const makeRequestJokeList = ({setJokeList}) => {
    axios({
        method: 'get',
        url: 'https://node-js-joke-list.herokuapp.com/items',
        headers: {
            "Content-Type": "application/json"
        }
      })
      .then((response) => {
        setJokeList(response.data)
      })
      .catch((error) => {
        console.log(error);
      });
}
export const makeRequestRandomJoke = ({setRandomJoke}) => {
    axios({
        method: 'get',
        url: 'https://api.chucknorris.io/jokes/random',
        headers: {
            "Content-Type": "application/json"
        }
      })
      .then((response) => {
        setRandomJoke(response.data)
      })
      .catch((error) => {
        console.log(error);
      });
}
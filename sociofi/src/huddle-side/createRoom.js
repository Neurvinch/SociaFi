import axios from 'axios';

export const createRoom = async () =>{

    const response = await axios.post("https://api.huddle01.com/api/v2/sdk/rooms/create-room",
        {title : "Private meet"},
        {headers : { 'x-api-key' : "ak_rTuZ9yUUnJDnAD2K"}}
    )
    return response.data.data.roomId;
}
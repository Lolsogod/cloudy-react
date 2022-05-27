import {useState, useContext} from "react";
import React from "react";
import axios from "axios";
import {AuthContext} from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export const UploadPage = () =>{
    const navigate = useNavigate();
    const [file, setFile] = useState(null)
    const auth = useContext(AuthContext)

    const onInput = element =>{
        setFile(element.target.files[0])
    }

    const onSubmit = element =>{
        element.preventDefault();

        const data = new FormData();
        console.log(file)
        data.append('file', file)
        console.log(data)

        axios.post('/api/files/upload', data, {
            headers: {
                Authorization: `Basic ${auth.token}`
            }})
            .then(e=>navigate("/files"))
            .catch(e=>console.log("err"))
    }

    return(
        <div>
            <h1>Upload</h1>
            <form method="post" action="#" id="#">
                <div className="upCont">
                    <label for="file" className="custom-upload">Choose</label>
                    <input type="file" name="file" id="file" multiple  onChange={onInput}/>
                    <span id="file-name">{file && file.name}</span>
                    
                    <button onClick={onSubmit}>Upload</button>
                </div>
            </form>
        </div>
    )
}
//<label htmlFor="file">Choose file to upload</label><br/>
//<input type="file" id="file" name="file" multiple onChange={onInput}/>
//
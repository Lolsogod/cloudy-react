import {useState, useContext} from "react";
import React from "react";
import axios from "axios";
import {AuthContext} from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export const UploadPage = ({curFolder, setCurFolderById}) =>{
    const navigate = useNavigate();
    const [file, setFile] = useState(null)
    const [error, setError] = useState("")
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
                Authorization: `Basic ${auth.token}`,
                        current: curFolder._id
            }})
            .then(()=>navigate("/files"))
            .catch(e=>setError(e.response.data.message))
    }

    return(
        <div>
            <h1>Upload</h1>
            <form method="post" action="#" id="#">
                <div className="upCont">
                    <label htmlFor="file" className="custom-upload">Choose</label>
                    <input type="file" name="file" id="file" multiple  onChange={onInput}/>
                    <span id="file-name">{file && file.name}</span>
                    <button onClick={onSubmit}>Upload</button>
                </div>
                <h2 className="error-msg">{error}</h2>
            </form>
        </div>
    )
}
//<label htmlFor="file">Choose file to upload</label><br/>
//<input type="file" id="file" name="file" multiple onChange={onInput}/>
//
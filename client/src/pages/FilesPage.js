import React, {useCallback, useContext, useEffect, useState} from "react";
import {AuthContext} from "../context/AuthContext";
import {FilesList} from "../components/FilesList";
import axios from "axios";



export const FilesPage = () =>{

    const [files, setFiles] = useState([])
    const {token} = useContext(AuthContext)

    const fetchFiles = useCallback( (callback) => {
        axios.get('/api/files/', {
            headers: {
                Authorization: `Basic ${token}`
            }})
            .then(e=>{
                callback(e.data);
            })
            .catch(e=>console.log("err: "+e))
    }, [token])

    useEffect(()=>{
        fetchFiles(setFiles)
    },[fetchFiles])

    return(
        <div>
            <h1>All Files:</h1>
            <FilesList files={files} fetchFiles={fetchFiles} setFiles={setFiles}/>
        </div>
    )
}
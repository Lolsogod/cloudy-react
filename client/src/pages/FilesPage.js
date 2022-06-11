import React, {useCallback, useContext, useEffect, useState} from "react";
import {AuthContext} from "../context/AuthContext";
import {FilesList} from "../components/FilesList";
import axios from "axios";
import {prettySize} from "../hooks/prettySize.hook"


export const FilesPage = () =>{

    const [files, setFiles] = useState([])
    const [spaceInfo, setSpaceInfo] = useState([])
    const {token} = useContext(AuthContext)

    const fetchFiles = useCallback( (callback) => {
        axios.get('/api/files/', {
            headers: {Authorization: `Basic ${token}`}})
            .then(e=>{callback(e.data);})
            .catch(e=>console.log("err: "+e))
    }, [token])

    const getSpaceInfo = useCallback( (callback) => {
        axios.get('/api/files/space/', {
            headers: {Authorization: `Basic ${token}`}})
            .then(e=>{callback(e.data);})
            .catch(e=>console.log("err: "+e))
    }, [token])

    useEffect(()=>{
        fetchFiles(setFiles)
    },[fetchFiles])

    useEffect(()=>{
        getSpaceInfo(setSpaceInfo)
    },[setSpaceInfo, files])


    return(
        <div className="fileContainer">
            <h1>All Files</h1>
            <FilesList files={files} fetchFiles={fetchFiles} setFiles={setFiles}/>
            <div className="storage">
                <div>Total: {prettySize(spaceInfo.total)}</div>
                <div>Free: {prettySize(spaceInfo.total-spaceInfo.occupied)}</div>
                <progress value={spaceInfo.occupied} max={spaceInfo.total}></progress>
            </div>
        </div>

    )
}
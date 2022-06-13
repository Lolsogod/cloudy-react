import React, {useCallback, useContext, useEffect, useState} from "react";
import {AuthContext} from "../context/AuthContext";
import {FilesList} from "../components/FilesList";
import axios from "axios";
import {prettySize} from "../hooks/prettySize.hook"


export const FilesPage = ({curFolder, setCurFolderById}) =>{
    const [files, setFiles] = useState([])
    const [spaceInfo, setSpaceInfo] = useState([])
    const [newFolder, setNewFolder] = useState("");
    const {token} = useContext(AuthContext)
    const fetchFiles = useCallback( (callback) => {
        axios.get(`/api/files/`, {
            headers: {Authorization: `Basic ${token}`},
            params: {
                folderId: curFolder._id
            }})
            .then(e=>{console.log(curFolder)
                callback(e.data);})
            .catch(e=>console.log("err: "+e))
    }, [token, curFolder])

    const getSpaceInfo = useCallback( (callback) => {
        axios.get('/api/files/space/', {
            headers: {Authorization: `Basic ${token}`}})
            .then(e=>{callback(e.data);})
            .catch(e=>console.log("err: "+e))
    }, [token])

    const changeHandler = event => {
        setNewFolder(event.target.value)
    }

    const createFolder = () => {
        axios.post('/api/files/new-folder/',
            {name: newFolder, parent: curFolder._id},
            {headers: {Authorization: `Basic ${token}`}})
            .then(()=>{fetchFiles(setFiles);})
            .catch(e=>console.log("err: "+e))
    }
    useEffect(()=>{
        fetchFiles(setFiles)
    },[fetchFiles])

    useEffect(()=>{
        getSpaceInfo(setSpaceInfo)
    },[setSpaceInfo, files])


    return(
        <div className="fileContainer">
            <h1>Все файлы</h1>
            <FilesList files={files} fetchFiles={fetchFiles} setFiles={setFiles}
                       curFolder={curFolder} setCurFolderById={setCurFolderById}/>
            <input type="text" placeholder="Введите название папки..."
                   name="folder" required onChange={changeHandler}
                   value={newFolder}/>
            <button onClick={createFolder}>create</button>
            <div className="storage">
                <div>Всего: {prettySize(spaceInfo.total)}</div>
                <div>Свободно: {prettySize(spaceInfo.total-spaceInfo.occupied)}</div>
                <progress value={spaceInfo.occupied} max={spaceInfo.total}></progress>
            </div>
        </div>
    )
}
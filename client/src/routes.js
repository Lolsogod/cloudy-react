import React, {useState} from "react";
import {Routes, Route, Navigate} from "react-router-dom";
import {UploadPage} from "./pages/UploadPage";
import {FilesPage} from "./pages/FilesPage";
import {AuthPage} from "./pages/AuthPage";
import {SharePage} from "./pages/SharePage"
import axios from "axios";

export const useRoutes = (isAuthenticated, token) => {
    const [curFolder, setCurFolder] = useState({_id: null})
    const  setCurFolderById = id =>{
        axios.get(`/api/files/info/${id}`, {
            headers: {Authorization: `Basic ${token}`}})
            .then(e=>{setCurFolder(e.data);})
            .catch(e=>console.log("err: "+e))
    }
    console.log(token)
    if (isAuthenticated){
        return(
            <Routes>
                <Route path="/files" element={<FilesPage curFolder={curFolder} setCurFolderById={setCurFolderById}/>} />
                <Route path="/upload" element={<UploadPage curFolder={curFolder} setCurFolderById={setCurFolderById}/> } />
                <Route path="/shared/:id" element={<SharePage />}/>
                <Route path="*" element={<Navigate to="/files" />} />
            </Routes>
        )
    }
    return (
        <Routes>
            <Route path="/" element={<AuthPage />}/>
            <Route path="/shared/:id" element={<SharePage />}/>
            <Route path="*" element={<Navigate to="/"/>} />
        </Routes>
    )
}
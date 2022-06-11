import React, {useEffect} from "react";
import axios from "axios";
import FileDownload from "js-file-download";
import {useParams} from "react-router-dom";


export const SharePage = () =>{
    let { id } = useParams();
    const downloadSharedFile = (id) => {
        axios.get(`/api/files/shared/${id}`, {
            responseType: 'blob',})
            .then((response) => {
                const fullName =(response.headers["content-disposition"].split("\"").at(-2))
                FileDownload(response.data, fullName);
        });
    }
    useEffect(()=>{
        downloadSharedFile(id)
    },[])
    return(
        <div className="fileContainer">
            <h1>file is being downloaded</h1>
        </div>

    )
}
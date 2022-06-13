import React, {useEffect} from "react";
import axios from "axios";
import FileDownload from "js-file-download";
import {useParams} from "react-router-dom";


export const SharePage = () =>{
    let { id } = useParams();
    let utf8decoder = new TextDecoder()
    const downloadSharedFile = (id) => {
        axios.get(`/api/files/shared/${id}`, {
            responseType: 'blob',})
            .then((response) => {
                let name = response.headers["content-disposition"].split(";")
                    .at(-1).split('=').at(-1).split("'")
                if(name[0] == "UTF-8")
                    name = decodeURIComponent(name.at(-1));
                else
                    name = name.at(0).slice(1, -1);
                FileDownload(response.data,name)

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
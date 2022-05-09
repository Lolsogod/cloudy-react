import React from "react";
import axios from "axios";
import {AuthContext} from "../context/AuthContext"
import {useContext} from "react";
import FileDownload from "js-file-download";


export const FilesList = ({files, setFiles, fetchFiles}) => {
    const {token} = useContext(AuthContext)
    const downloadFile = (id, path) => {
        axios.get(`api/files/${id}`, {
            responseType: 'blob',
            headers: {
                Authorization: `Basic ${token}`
            }}).then((response) => {
                const fullName = path.split("/").slice(-1)[0]
            FileDownload(response.data, fullName);
        });
    }

    const deleteFile = (id, path) => {
        axios.delete(`api/files/delete/${id}`, {
            headers: {
                Authorization: `Basic ${token}`
            }
        }).then(() =>{
            fetchFiles(setFiles)
        })
    }
    if (!files.length){
        return <p>нет файлов</p>
    }
    return(
        <table>
            <thead>
                <tr>
                    <th>n</th>
                    <th>Имя</th>
                    <th>Размер</th>
                    <th>Дата</th>
                </tr>
            </thead>
            <tbody>
            {files.map((file, index) =>{
                return(
                    <tr key={file._id}>
                        <td>{index + 1}</td>
                        <td>{file.name + "." + file.extension}</td>
                        <td>{file.size}</td>
                        <td>{file.date}</td>
                        <td className={"download"} onClick={() => downloadFile(file._id, file.path)}>Download</td>
                        <td className={"download"} onClick={() => deleteFile(file._id, file.path)}>Delete</td>
                    </tr>
                )})
            }
            </tbody>
        </table>
    )
}
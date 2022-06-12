import React from "react";
import axios from "axios";
import {AuthContext} from "../context/AuthContext"
import {useContext} from "react";
import FileDownload from "js-file-download";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {getIcon} from "../hooks/icons.hook";
import {faTrashCan, faDownload, faLink, faShare, faStop} from "@fortawesome/free-solid-svg-icons"
import {prettySize} from "../hooks/prettySize.hook"

export const FilesList = ({files, setFiles, fetchFiles}) => {
    const {token} = useContext(AuthContext)
    const downloadFile = (id, path) => {
        axios.get(`api/files/${id}`, {
            responseType: 'blob',
            headers: {Authorization: `Bearer ${token}`}})
            .then((response) => {
                const fullName = path.split("\\").slice(-1)[0]
            FileDownload(response.data, fullName);
        });
    }

    const deleteFile = (id) => {
        axios.delete(`api/files/delete/${id}`, {
            headers: {Authorization: `Bearer ${token}`}})
            .then(() =>{fetchFiles(setFiles)})
            .catch(e=>alert("Неудалось поделится: " + e))
    }
    const shareFile = (id) => {
        axios.put(`api/files/share/${id}`, {},{
            headers: {Authorization: `Bearer ${token}`}})
            .then(() =>{fetchFiles(setFiles)})
            .catch(e=>alert("Неудалось поделится: " + e))
    }
    const copyLink = (id) => {
        navigator.clipboard.writeText(`${window.location.host}/shared/${id}`)
            .then(() => alert("Ссылка скопированна."))
            .catch(e=> alert("Неудалось скопировать ссылку: " + e))
    }
    if (!files.length){
        return <p>нет файлов</p>
    }

    return(
        <table>
            <thead>
                <tr>
                    <th>№</th>
                    <th> </th>
                    <th>Имя</th>
                    <th>Размер</th>
                    <th>Дата</th>
                </tr>
            </thead>
            <tbody>
            {files.map((file, index) =>{
                return(
                    <tr key={file._id}>
                        <td className="darker">{index + 1}</td>
                        <td><FontAwesomeIcon icon={getIcon(file.type, file.extension)} /></td>
                        <td>{file.name + "." + file.extension + " "}
                            {file.shared && <FontAwesomeIcon onClick={() => copyLink(file._id)}
                                                             className="link-ico" icon={faLink} />}
                        </td>
                        <td >{prettySize(file.size)}</td>
                        <td>{file.date.split("T")[0]}</td>
                        <td className={"download"} onClick={() => shareFile(file._id, file.path)}>
                            <FontAwesomeIcon icon={file.shared?faStop:faShare} /></td>
                        <td className={"download"} onClick={() => downloadFile(file._id, file.path)}>
                            <FontAwesomeIcon icon={faDownload} /></td>
                        <td className={"download delete"} onClick={() => deleteFile(file._id)}>
                            <FontAwesomeIcon icon={faTrashCan} /></td>
                    </tr>
                )})
            }
            </tbody>
        </table>
    )
}
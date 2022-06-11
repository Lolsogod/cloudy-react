import React from "react";
import axios from "axios";
import {AuthContext} from "../context/AuthContext"
import {useContext} from "react";
import FileDownload from "js-file-download";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMusic, faImage, faFile, faFilm, faFileLines, faFont, faCube} from "@fortawesome/free-solid-svg-icons";
import {faFileWord, faBook, faFilePowerpoint, faFilePdf, faFileZipper, faFileExcel} from "@fortawesome/free-solid-svg-icons"
import {faTrashCan, faDownload, faLink, faShare, faStop} from "@fortawesome/free-solid-svg-icons"
import {prettySize} from "../hooks/prettySize.hook"

export const FilesList = ({files, setFiles, fetchFiles}) => {
    //сделать хуком
    const icons = new Map()
    //primary
    icons.set("audio", faMusic)
    icons.set("font", faFont)
    icons.set("image", faImage)
    icons.set("model", faCube)
    icons.set("text", faFileLines)
    icons.set("video", faFilm)
    //secondary
    icons.set("msword", faFileWord)
    icons.set("vnd.openxmlformats-officedocument.wordprocessingml.document", faFileWord)
    icons.set("epub+zip", faBook)
    icons.set("json", faFileLines)
    icons.set("xml", faFileLines)
    icons.set("js",faFileLines)
    icons.set("py",faFileLines)
    icons.set("pdf", faFilePdf)
    icons.set("sql", faFileLines)
    icons.set("java", faFileLines)
    icons.set("vnd.ms-powerpoint", faFilePowerpoint)
    icons.set("vnd.openxmlformats-officedocument.presentationml.presentation", faFilePowerpoint)
    icons.set("vnd.rar", faFileZipper)
    icons.set("zip", faFileZipper)
    icons.set("rar", faFileZipper)
    icons.set("7z", faFileZipper)
    icons.set("x-7z-compressed", faFileZipper)
    icons.set("vnd.ms-excel", faFileExcel)
    icons.set("vnd.openxmlformats-officedocument.spreadsheetml.sheet", faFileExcel)

    const getIcon = (mimeType, ext)=>{
        let split = mimeType.split("/")
        if (icons.has(split[0]))
            return icons.get(split[0])
        else if (icons.has(split[1]))
            return icons.get(split[1])
        else if (icons.has(ext))
            return icons.get(ext)
        return faFile
    }

    const {token} = useContext(AuthContext)
    const downloadFile = (id, path) => {
        axios.get(`api/files/${id}`, {
            responseType: 'blob',
            headers: {
                Authorization: `Basic ${token}`
            }}).then((response) => {
                const fullName = path.split("\\").slice(-1)[0]
                console.log(path)
            FileDownload(response.data, fullName);
        });
    }

    const deleteFile = (id) => {
        axios.delete(`api/files/delete/${id}`, {
            headers: {Authorization: `Basic ${token}`}
        }).then(() =>{
            fetchFiles(setFiles)
        })
    }
    const shareFile = (id) => {
        axios.put(`api/files/share/${id}`, {},{
            headers: {Authorization: `Basic ${token}`}
        }).then(() =>{fetchFiles(setFiles)})
        //later
    }
    const copyLink = (id) => {
        navigator.clipboard.writeText(`${window.location.host}/shared/${id}`)
            .then(() => alert("ссылка скопированна"))
        //later
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
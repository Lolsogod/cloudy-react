import {
    faBook,
    faCube, faFile, faFileExcel,
    faFileLines, faFilePdf, faFilePowerpoint,
    faFileWord, faFileZipper,
    faFilm,
    faFont,
    faImage,
    faMusic
} from "@fortawesome/free-solid-svg-icons";

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

export const getIcon = (mimeType, ext)=>{
    let split = mimeType.split("/")
    if (icons.has(split[0]))
        return icons.get(split[0])
    else if (icons.has(split[1]))
        return icons.get(split[1])
    else if (icons.has(ext))
        return icons.get(ext)
    return faFile
}
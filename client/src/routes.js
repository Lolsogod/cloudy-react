import React from "react";
import {Routes, Route, Navigate} from "react-router-dom";
import {UploadPage} from "./pages/UploadPage";
import {FilesPage} from "./pages/FilesPage";
import {AuthPage} from "./pages/AuthPage";
import {SharePage} from "./pages/SharePage"

export const useRoutes = isAuthenticated => {
    if (isAuthenticated){
        return(
            <Routes>
                <Route path="/files" element={<FilesPage />} />
                <Route path="/upload" element={<UploadPage/>} />
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
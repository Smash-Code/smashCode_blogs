import { useState, useEffect } from 'react'
import CustomTabs from "utils/CustomTabs";
import { PermMedia, NoteAdd, VideoCall } from "@material-ui/icons";
import MediaUpload from "./MediaUpload";
import VideoManage from "./VideoManage";
import DocManage from "./DocManage";
import { db } from 'config/firebase';
import {getSortByTransactionDate} from "store/action";

const FilesManage = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [mediaData, setMediaData] = useState([]);
    const [videoData, setVideoData] = useState([]);
    const [docsData, setDocsData] = useState([]);
    const tabHeads = [
        { title: "Media", icon: <PermMedia /> },
        { title: "Videos", icon: <VideoCall /> },
        { title: "Docs", icon: <NoteAdd /> },
    ],
        tabPanels = [
            <MediaUpload data={mediaData} />,
            <VideoManage data={videoData}/>,
            <DocManage data={docsData}/>,
        ];

    useEffect(() => {
        db.ref('uploads/media').on('value', function (snap) {
            if (snap.exists()) {
                let data = Object.values(snap.val()).map((data) => data)
                setMediaData(data.sort(getSortByTransactionDate));
            }
        });
        db.ref('uploads/videos').on('value', function (snap) {
            if (snap.exists()) {
                let data = Object.values(snap.val()).map((data) => data)
                setVideoData(data.sort(getSortByTransactionDate));
            }
        });
        db.ref('uploads/docs').on('value', function (snap) {
            if (snap.exists()) {
                let data = Object.values(snap.val()).map((data) => data)
                setDocsData(data.sort(getSortByTransactionDate));
            }
        });
    }, []);

    return (
        <div className="my-3">
            <CustomTabs
                tabValue={activeTab}
                setTabValue={setActiveTab}
                tabHeads={tabHeads}
                tabPanels={tabPanels}
            />
        </div>
    )
}

export default FilesManage

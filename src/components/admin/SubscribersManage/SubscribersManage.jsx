import { useState, useEffect } from 'react';
import { db } from "config/firebase";
import ConfirmDialog from "utils/ConfirmDialog";
import Loader from "utils/Loader";
import { useNotifyContext } from "context/notifyContext";
import { TextField, TableCell, TableBody } from "@material-ui/core";
import { DelBtn, CopyBtn } from "utils/btns"
import UseTable from "../Tools/table/Tbl";
import { BsCheckAll } from "react-icons/bs";
import noDataFoundImg from "assets/images/noDatafound.png"


let dbSubscribersRef = db.ref('subscribers');

// Data Table setup
const HeadCells = [
    'Email',
    'DB ID',
    'Action',
]

const SubscribersManage = () => {
    let [subscriberData, setSubscriberData] = useState([]);
    const [askModel, setAskModel] = useState({ open: false, btn1: true, btn2: false, head: "", info: "" });
    const [dataLoaded, setDataLoaded] = useState(false);

    useEffect(() => {
        function getAll_Subs_data() {
            dbSubscribersRef.on('value', function (snapshot) {
                const data = snapshot.val();
                setDataLoaded(true);
                if (data) {
                    setSubscriberData(Object.values(data).filter((val) => val));
                } else {
                    setSubscriberData([]);
                }
            });
        };
        getAll_Subs_data();
        return () => getAll_Subs_data();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div>
            {/* Confirm Dialog */}
            <ConfirmDialog
                data={askModel}
                onClick={() => { setAskModel({ open: false, btn1: true, btn2: false, head: "", info: "" }); askModel.func && askModel.func() }}
                setAskModel={setAskModel}
            />
            {subscriberData?.length > 0 ?
                <RecordsTable allEmails_Data={subscriberData} setAskOpenPopup={setAskModel} />
                :
                <div className="p-5 text-center">
                    {dataLoaded ? <p>No Subscribers data are found.</p>
                        : <Loader type="imgloader" />}
                </div>
            }
        </div>
    )
};

// records Table
const RecordsTable = (props) => {
    const { set_notify } = useNotifyContext();
    const [data, setDta] = useState([]);
    const [searching, setSearching] = useState(false);
    const { TblContainer, TblHead, StyledTableRow, rowsPerPage, page } = UseTable(searching ? data : props.allEmails_Data, HeadCells); function removeSelectedData(nam) {
        props.setAskOpenPopup({
            open: true,
            btn1: true, btn2: true,
            head: "Confirm",
            func: () => delRecord(nam),
            info: "Are you sure you want to delete this record?"
        })
    };
    const delRecord = (nam) => {
        if (nam) {
            dbSubscribersRef.child(nam).remove().then(() => {
                set_notify({ type: "error", open: true, msg: "Record deleted successfully" })
                props.setAskOpenPopup({
                    open: false,
                    btn1: true, btn2: false,
                    head: "",
                    info: ""
                })
            }).catch(() => {
                set_notify({ type: "error", open: true, msg: "Something went wrong!" })
            })
        } else {
            set_notify({ type: "error", open: true, msg: "Something went wrong!" })
            props.setAskOpenPopup({
                open: false,
                btn1: true, btn2: false,
                head: "",
                info: ""
            })
        }
    };
    const handleSearch = e => {
        let value = e.target.value.toLowerCase();
        setDta(props.allEmails_Data.filter(x => x.email.toLowerCase().includes(value)));
        if (value.length > 0) {
            setSearching(true);
        } else {
            setSearching(false);
        }
    };
    function copyEmail(email) {
        navigator.clipboard.writeText(email);
        set_notify({open:true, msg:"Copied successfully!", type:'success'});
      }
    return (
        <>
            <TextField
                variant="filled"
                label="Search records"
                placeholder="You can search records by Email."
                onChange={handleSearch}
                fullWidth
            />
            <TblContainer>
                <TblHead />
                <TableBody>
                    {Object.values(props.allEmails_Data) &&
                        searching ?
                        <>
                            {data.length ?
                                data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, i) => {
                                    return (
                                        <StyledTableRow key={i} className="search-records-row">
                                            <TableCell component="td" scope="row">
                                                <p>{item.email}</p>
                                            </TableCell>
                                            <TableCell component="td" scope="row">
                                                <p>
                                                    {item.id}
                                                </p>
                                            </TableCell>
                                            <TableCell align="left" className="d-flex justify-content-center align-items-center align-content-center">
                                                <CopyBtn onClick={() => copyEmail(item?.email)} />
                                                <DelBtn onClick={() => removeSelectedData(item.id)} />
                                            </TableCell>
                                            <td className="search-res-notify d-flex"><span>found</span><BsCheckAll /></td>
                                        </StyledTableRow>
                                    )
                                })
                                : <tr>
                                    <td colSpan={5}>
                                        <div className="no-record-found">
                                            <h4>No records found!</h4>
                                            <div className="no-record-img-wrap">
                                                <img src={noDataFoundImg} alt="no data found" />
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            }

                        </>
                        :
                        <>
                            {
                                Object.values(props.allEmails_Data).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, i) => {
                                    return (
                                        <StyledTableRow key={i}>
                                            <TableCell component="td" scope="row">
                                                <p>{item.email}</p>
                                            </TableCell>
                                            <TableCell component="td" scope="row">
                                                <p>
                                                    {item.id}
                                                </p>
                                            </TableCell>
                                            <TableCell align="left" className="d-flex justify-content-center align-items-center align-content-center h-100">
                                                <CopyBtn onClick={() => copyEmail(item?.email)} />
                                                <DelBtn onClick={() => removeSelectedData(item.id)} />
                                            </TableCell>
                                        </StyledTableRow>
                                    )
                                })
                            }
                        </>
                    }
                </TableBody>
            </TblContainer>
        </>
    )
}


export default SubscribersManage;

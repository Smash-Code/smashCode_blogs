import { useState } from "react";
import { Card, CardContent, CardMedia, IconButton, Typography, CardActionArea, CardActions } from '@material-ui/core';
import "./blogCard.css";
import ShareDropdown from "./ShareDropdown";
import { Link } from 'react-router-dom';
import { FaRegEye } from 'react-icons/fa';

let replaceAllSpaces = (para) =>{
    return para?.replace(/\s+/g, '-')?.toLowerCase();
}

export default function BlogCard({ data, type, descLength }) {
    const [open, setOpen] = useState(false);


    // function numFormatter(num) {
    //     if (num > 999 && num < 1000000) {
    //         return (num / 1000).toFixed(1) + 'K'; // convert to K for number from > 1000 < 1 million 
    //     } else if (num > 1000000) {
    //         return (num / 1000000).toFixed(1) + 'M'; // convert to M for number from > 1 million 
    //     } else if (num < 900) {
    //         return num; // if value < 1000, nothing to do
    //     }
    // }
    function nFormatter(num, digits) {
        var si = [
            { value: 1, symbol: "" },
            { value: 1E3, symbol: "k" },
            { value: 1E6, symbol: "M" },
            { value: 1E9, symbol: "G" },
            { value: 1E12, symbol: "T" },
            { value: 1E15, symbol: "P" },
            { value: 1E18, symbol: "E" }
        ];
        var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
        var i;
        for (i = si.length - 1; i > 0; i--) {
            if (num >= si[i].value) {
                break;
            }
        }
        return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
    }

    // var tests = [
    //     { num: 1234, digits: 1 },
    //     { num: 100000000, digits: 1 },
    //     { num: 299792458, digits: 1 },
    //     { num: 759878, digits: 1 },
    //     { num: 759878, digits: 0 },
    //     { num: 123, digits: 1 },
    //     { num: 123.456, digits: 1 },
    //     { num: 123.456, digits: 2 },
    //     { num: 123.456, digits: 4 }
    // ];
    // var i;
    // for (i = 0; i < tests.length; i++) {
    //     console.log("nFormatter(" + tests[i].num + ", " + tests[i].digits + ") = " + nFormatter(tests[i].num, tests[i].digits));
    // }

    // console.log(nFormatter(5000,0))
    // console.log(nFormatter(5000,0))


    if (type === "only-img") {
        return (
            <Card className="mb-3">
                <CardActionArea
                    className="a-white  overflow-hidden position-relative text-white text-decoration-none"
                    component={Link}
                    to={`/blog/${replaceAllSpaces(data.title)}/${data.id}`}>
                    <CardMedia
                        className="img-card-media"
                        component="img"
                        height="200"
                        image={data?.blog_img}
                        alt={data?.title || "."}
                    />
                    <CardContent className="img-card-content">
                        <Typography
                            className="blog-card-title"
                            gutterBottom
                            variant="h5">
                            {data?.title.slice(0, 25) + '...'}
                        </Typography>
                        <Typography
                            className="blog-card-desc"
                            variant="body2"
                            color="inherit">
                            {data.description?.slice(0, descLength || 280)}
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
        )
    }
    else {
        return (
            <div className="cs-blog-card">
                <div className="cs-blog-card-img">
                    <Link to={`/blog/${replaceAllSpaces(data.title)}/${data.id}`}>
                        <img src={data?.blog_img || ''} alt={data?.title || "."} />
                    </Link>
                </div>
                <div className="cs-blog-card-content">
                    <Link to={`/blog/${replaceAllSpaces(data.title)}/${data.id}`} className="cs-card-title">{data?.title?.slice(0, 50)}</Link>
                    <Link to={`/blog/${replaceAllSpaces(data.title)}/${data.id}`} className="cs-card-bodyText">{data?.description?.slice(0, 130)}</Link>
                </div>
                <div className="cs-blog-card-footer">
                    <div className="cs-card-share-side">
                        <button className="cs-card-share-btn"
                            onClick={(e) => {
                                e.preventDefault();
                                setOpen(e.currentTarget);
                            }}>
                            <svg width="18px" height="18px" viewBox="0 0 1024 1024"
                                fill="var(--primary)">
                                <path d="M768 853.333c-47.104 0-85.333-38.229-85.333-85.333s38.229-85.333 85.333-85.333c47.104 0 85.333 38.229 85.333 85.333s-38.229 85.333-85.333 85.333zM256 597.333c-47.104 0-85.333-38.229-85.333-85.333s38.229-85.333 85.333-85.333c47.104 0 85.333 38.229 85.333 85.333s-38.229 85.333-85.333 85.333zM768 170.667c47.104 0 85.333 38.229 85.333 85.333s-38.229 85.333-85.333 85.333c-47.104 0-85.333-38.229-85.333-85.333s38.229-85.333 85.333-85.333zM768 597.333c-52.437 0-98.688 24.107-130.005 61.312l-213.675-123.392c1.067-7.637 2.347-15.275 2.347-23.253 0-4.779-1.024-9.259-1.408-13.909l218.283-126.037c31.104 33.408 75.179 54.613 124.459 54.613 94.251 0 170.667-76.416 170.667-170.667s-76.416-170.667-170.667-170.667c-94.251 0-170.667 76.416-170.667 170.667 0 14.208 2.261 27.819 5.504 41.003l-205.867 118.912c-30.763-45.013-82.389-74.581-140.971-74.581-94.251 0-170.667 76.416-170.667 170.667s76.416 170.667 170.667 170.667c55.467 0 104.235-26.88 135.424-67.84l209.195 120.747c-2.048 10.539-3.285 21.333-3.285 32.427 0 94.251 76.416 170.667 170.667 170.667s170.667-76.416 170.667-170.667c0-94.251-76.416-170.667-170.667-170.667z"></path>
                            </svg>
                        </button>
                        <ShareDropdown
                            onClick={(e) => {
                                e.preventDefault();
                            }}
                            handleClose={() => setOpen(null)}
                            open={open}
                            url={`${window.location.host}/blog/${data.id}`}
                            twitter_url={`${window.location.host}/blog/${data.id}&title=${data?.title}&image=${data?.blog_img}`}

                        />

                    </div>
                    <div className="cs-card-views-side">
                        <span> <FaRegEye className="views-icon" />
                            &nbsp;{data?.views &&
                                nFormatter(Number(data.views?.toString().replaceAll(",", '') || 0))
                            } views</span>
                    </div>
                </div>
            </div>
            // <Card className="blog-cardd d-flex flex-column">
            //     <CardActionArea
            //         className="a-white text-white text-decoration-none"
            //         component={Link}
            //         to={`/blog/${data.id}`}>
            //         <CardMedia
            //             className="text-center cardd-img"
            //             component="img"
            //             height="160"
            //             image={data?.blog_img}
            //             alt={data?.title || "."}
            //         />
            //         <CardContent>
            //             <Typography className="blog-card-title" gutterBottom variant="h5" component="div">
            //                 {data?.title.slice(0, 23)}
            //             </Typography>
            //             <Typography className="blog-card-desc" variant="body2" color="inherit">
            //                 {data.description?.slice(0, 150)}
            //             </Typography>
            //         </CardContent>
            //     </CardActionArea>
            //     <CardActions className="border-top border-secondary d-flex justify-content-between align-items-center mt-auto">
            //         <IconButton
            //             onClick={(e) => {
            //                 e.preventDefault();
            //                 setOpen(e.currentTarget);
            //             }}
            //             color="secondary" className="float-right">
            //             <svg width="21px" height="21px" viewBox="0 0 1024 1024"
            //                 fill="var(--primary)">
            //                 <path d="M768 853.333c-47.104 0-85.333-38.229-85.333-85.333s38.229-85.333 85.333-85.333c47.104 0 85.333 38.229 85.333 85.333s-38.229 85.333-85.333 85.333zM256 597.333c-47.104 0-85.333-38.229-85.333-85.333s38.229-85.333 85.333-85.333c47.104 0 85.333 38.229 85.333 85.333s-38.229 85.333-85.333 85.333zM768 170.667c47.104 0 85.333 38.229 85.333 85.333s-38.229 85.333-85.333 85.333c-47.104 0-85.333-38.229-85.333-85.333s38.229-85.333 85.333-85.333zM768 597.333c-52.437 0-98.688 24.107-130.005 61.312l-213.675-123.392c1.067-7.637 2.347-15.275 2.347-23.253 0-4.779-1.024-9.259-1.408-13.909l218.283-126.037c31.104 33.408 75.179 54.613 124.459 54.613 94.251 0 170.667-76.416 170.667-170.667s-76.416-170.667-170.667-170.667c-94.251 0-170.667 76.416-170.667 170.667 0 14.208 2.261 27.819 5.504 41.003l-205.867 118.912c-30.763-45.013-82.389-74.581-140.971-74.581-94.251 0-170.667 76.416-170.667 170.667s76.416 170.667 170.667 170.667c55.467 0 104.235-26.88 135.424-67.84l209.195 120.747c-2.048 10.539-3.285 21.333-3.285 32.427 0 94.251 76.416 170.667 170.667 170.667s170.667-76.416 170.667-170.667c0-94.251-76.416-170.667-170.667-170.667z"></path>
            //             </svg>
            //         </IconButton>
            //         <ShareDropdown
            //             onClick={(e) => {
            //                 e.preventDefault();
            //             }}
            //             handleClose={() => setOpen(null)}
            //             open={open}
            //             url={`${window.location.host}/blog/${data.id}`}
            //             twitter_url= {`${window.location.host}/blog/${data.id}&title=${data?.title}&image=${data?.blog_img}`}

            //         />
            //         <Typography variant="body2" className="ml-auto float-right">
            //             <FaRegEye style={{ color: "var(--light) !important", fontSize: "18px" }} className="text-white" /> 
            //             &nbsp;{data?.views &&
            //              nFormatter(Number(data.views?.toString().replaceAll(",",'') || 0))
            //             }  views
            //         </Typography>
            //     </CardActions>
            // </Card>
        );
    }
}


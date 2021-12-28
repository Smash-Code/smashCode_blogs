import { Typography } from '@material-ui/core'
import { FaRegEye } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const BigBlogCard = ({ data }) => {
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

    return (
        <Link to={`/blog/${data.id}`} 
        className="big-card-wrapper text-decoration-none a-white d-flex flex-column justify-content-end align-items-end"
            // style={{ background: `url(${data?.blog_img?.toString() || ""})` }}
        >
            <img className="most-recent-blog-img" src={data?.blog_img} alt="" />
            {/* {console.log(data.blog_img)} */}
            <div className="bg-blog-card-views">
               <p className="m-0"> <FaRegEye /> &nbsp;{data?.views &&
                    nFormatter(Number(data.views?.toString().replaceAll(",", '') || 0))
                }  views
                </p>
            </div>
            <div className="big-blog-bottom">
                <Typography variant="h5" className="mb-2">{data?.title.slice(0, 55)}</Typography>
                <Typography variant="body1">{data?.description.slice(0, 150)}</Typography>
            </div>
            {/* <div className="top-blog-badge">
                <Typography variant="h6">Top Blogs</Typography>
            </div> */}
        </Link>
    )
}

export default BigBlogCard

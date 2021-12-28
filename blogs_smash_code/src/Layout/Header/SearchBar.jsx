import { useState } from 'react'
import placeholderImg from "assets/images/placeholder-img.jpg"
import { Link } from "react-router-dom";
import { Visibility } from "@material-ui/icons";
import { useDataContext } from "context/DataContext";

const SearchBar = ({ open,closeSearch }) => {
    const [searchedData, setSearchedData] = useState([]);
    const { full_blogs_data } = useDataContext();

    const sendSearchForm = (e) => {
        e.preventDefault();
    }
    const handleSearch = (e) => {
        let { value } = e.target;
        if (value.length > 0) {
            setSearchedData(
                full_blogs_data.data.filter(x => 
                    x.title.toLowerCase().includes(value.toLowerCase()) ||
                    x.description.toLowerCase().includes(value.toLowerCase()) ||
                    x.tags && x.tags.includes(value)
                ));
        }else{
            setSearchedData([])
        }
    }
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
        <div className={`search-bar-container ${open ? 'show-search-barr' : ''}`}>
            <form onSubmit={sendSearchForm}>
                <div className="search-bar-wrapper">
                    <div className="search-bar-input">
                        <input
                            type="search"
                            name="search"
                            placeholder="Search here..."
                            onChange={handleSearch}
                        />
                    </div>
                    {/* <div className="search-bar-btns">
                        <button type="submit">Search</button>
                    </div> */}
                </div>
            </form>
            {searchedData && searchedData.length > 0 &&
                <div className="search-result-data-wrapper">
                    {searchedData.map((blog, i) => (
                        <Link onClick={()=> closeSearch()} key={i} to={`/blog/${blog.id}`} className="a-white result-tem">
                            <div className="result-tem-body">
                                <img src={blog.blog_img || placeholderImg} alt={blog?.tags ? blog.tags[0]  : blog.title?.slice(0,15)} />
                                <p>
                                   {blog.title.slice(0,150)}
                                </p>
                            </div>
                            <div className="result-item-bottom">
                                <p>
                                {blog && blog?.views &&
                                    nFormatter(Number(blog.views?.toString().replaceAll(",", '') || 0))
                                } 
                                </p> &nbsp; <Visibility />
                            </div>
                        </Link>
                    ))}

                </div>
            }
        </div>
    )
}

export default SearchBar

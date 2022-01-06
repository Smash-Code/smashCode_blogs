import { useState, useEffect } from 'react';
import { withRouter, useParams } from "react-router-dom";
import { CustomCardSkeleton } from "utils/skeleton";
import { Typography, Chip, Button } from "@material-ui/core";
import { ArrowBack } from "@material-ui/icons";
import { Link } from "react-router-dom";
import { useDataContext } from "context/DataContext";
import BlogCard from "utils/blogCard";

let replaceAllSpaces = (para) =>{
    return para?.replace(/\s+/g, '-')?.toLowerCase();
}


const CategoryBlog = (props) => {
    let {categoryID,categoryTittle} = useParams();
    const [blogsData, setBlogsData] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const { allBlogsData, allCategories } = useDataContext();
    const [selected_cate, setSelected_cate] = useState({});

    useEffect(() => {
        // console.log(categoryID)
        if (categoryID && allBlogsData && allBlogsData.data.length > 0 && allCategories.data.length > 0) {
            let filtered = allBlogsData.data.filter((blog) => blog.category?.id === categoryID);
            setBlogsData(filtered);
            let fil_ter_Cate = allCategories.data.filter((category) => category.id === categoryID);
            setSelected_cate(fil_ter_Cate[0] || {});

        } else {
            setTimeout(() => {
                !loaded && setLoaded(true);
            }, 5000)
        }
    }, [categoryID, allBlogsData, allCategories]);


    return (
        <div className="blog-container">
            <div className="row px-2 mb-4">
                <div className="col-12 p-0 mb-2">
                    <Button variant="contained" color="primary" onClick={()=> props?.history?.goBack()}  className="text-white px-2 py-1 cursor-pointer">
                   <ArrowBack className=" rounded-circle" size="large"/>
                   &nbsp; 
                    <span> Back</span>
                    </Button>
                </div>
                <div className="col-sm-8 p-0 col-12">
                    <Typography variant="h2" color="inherit">{selected_cate.title}</Typography>
                    <Typography variant="subtitle1" color="inherit">Category</Typography>
                </div>
                <div className="col-sm-4 p-0 col-12 align-items-center d-flex justify-content-end text-right">
                    <Typography variant="subtitle2" color="inherit">Blogs: &nbsp;</Typography>
                    <Typography variant="subtitle1" color="inherit">{blogsData.length < 10 ? "0" + blogsData.length : blogsData.length}</Typography>
                </div>
                <div className="col-12 my-2"></div>
                    {allBlogsData && allBlogsData.data.length > 0 && blogsData.length > 0 ?
                        blogsData.map((item, index) => (
                            // <div key={index} className="col-lg-3 my-2 col-md-4 col-6">
                            <BlogCard key={index} type="normal" data={item} />
                            // </div>
                        ))
                        :
                        <>
                            {loaded ?
                                <div className="my-5 mx-auto text-center">
                                    <h5 className="mb-3">No Blogs are Found</h5>
                                    <Button component={Link} to="/blogs" variant="outlined" color="inherit">View Other blogs</Button>
                                </div>
                                :
                                [...new Array(8)].map((item, index) => (
                                    // <div  className="col-lg-3 my-2 col-md-4 col-6">
                                    <CustomCardSkeleton key={index} />
                                    // </div>
                                ))
                            }
                        </>
                    }
            </div>
            {allCategories && allCategories.data?.length > 0 &&
                <div className="row my-4">
                    <div className="col-12">
                        <Typography className="mb-3" variant="h4" color="inherit">All Categories</Typography>
                        {allCategories.data.map((category) => (
                            <Chip
                                className="m-2 cursor-pointer chip-Links"
                                variant="outlined"
                                component={Link}
                                to={`/category/${replaceAllSpaces(category.title)}/${category.id}`}
                                label={category.title}
                            />
                        ))}
                    </div>
                </div>}
        </div>
    )
};




export default withRouter(CategoryBlog);

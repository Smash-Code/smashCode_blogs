import { useState, useEffect } from "react";
import BlogCard from "utils/blogCard";
import { Typography, Button } from '@material-ui/core';
import { CustomCardSkeleton } from "utils/skeleton";
import { useDataContext } from "context/DataContext";

const Featured = (props) => {
    const [featureds, setFeatureds] = useState([]);
    const [hide, setHide] = useState(false);
    const { featuredBlogs } = useDataContext();

    useEffect(() => {
        if (featuredBlogs && featuredBlogs.data) {
            setFeatureds(featuredBlogs.data.slice(0, 16));
        }
    }, [featuredBlogs]);

    // TODO: call more data from database
    const viewMoreFeatured = () => {
        let prevLength = featureds.length;
        if (featuredBlogs.data?.length > prevLength) {
            setFeatureds(featuredBlogs.data.slice(0, prevLength + 8))
        } else {
            setHide(true)
        }

    }

    return (
        <div className="blog-container mt-2 mb-3">
            <div className="row">
                <div className="col-12 mb-2">
                    <Typography variant="h3" color="inherit">Featured</Typography>
                </div>
                {featuredBlogs && featuredBlogs.data.length > 0 && featureds.length > 0 ?
                    featureds.map((item, index) => (
                        <div key={index} className="col-lg-3 my-2 col-md-4 col-6">
                            <BlogCard type="normal" data={item} />
                        </div>
                    ))
                    :
                    [...new Array(8)].map((item, index) => (
                        <div key={index} className="col-lg-3 my-2 col-md-4 col-6">
                            <CustomCardSkeleton />
                        </div>
                    ))
                }
                {featuredBlogs && featuredBlogs.data.length > 0 && featureds.length > 0 && !hide && 
                <div className="col-12 my-3 text-center">
                    <Button onClick={viewMoreFeatured} variant="outlined" color="inherit">View more</Button>
                </div>}
            </div>

        </div>
    )
}


export default Featured;

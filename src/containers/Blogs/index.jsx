import { useState, useEffect } from "react";
import BlogCard from "utils/blogCard";
import { Typography, Button, Chip } from '@material-ui/core';
import { CustomCardSkeleton, CustomBigCardSkeleton } from "utils/skeleton";
import { useDataContext } from "context/DataContext";
import BigBlogCard from "utils/bigBlogCard";
import { Link } from "react-router-dom";

const Blogs = () => {
    const [blogs, setBlogs] = useState([]);
    const { mostViewedBlogs, allBlogsData, featuredBlogs, loadMore, is_more_data, allCategories } = useDataContext();

    useEffect(() => {
        if (allBlogsData && allBlogsData.data) {
            let old_length = blogs.length;
            setBlogs(allBlogsData.data.slice(0, old_length + 16));
        }
        document.title = 'Smash-Code';
    }, [allBlogsData, mostViewedBlogs]);

    // Recent blogs view more
    const viewMore = () => {
        let prevLength = blogs.length;
        if (prevLength > 8) {
            loadMore()
        } else {
            if (allBlogsData.data?.length > prevLength) {
                setBlogs(allBlogsData.data.slice(0, prevLength + 16))
            } else {
                loadMore()
            }
        }
    }

    return (
        <>
            <div className="blog-container mt-2 mb-3">
                <div className="row">
                    <div className="col-md-8 col-12">
                        {mostViewedBlogs.topBlogsLoaded && mostViewedBlogs.data && mostViewedBlogs.data.length > 0 ?
                            <BigBlogCard data={mostViewedBlogs.data[0]} />
                            : <CustomBigCardSkeleton />
                        }
                    </div>
                    <div className="col-md-4 col-12">
                        {mostViewedBlogs.topBlogsLoaded && mostViewedBlogs.data
                            &&
                            mostViewedBlogs.data.length > 0
                            &&
                            mostViewedBlogs.data[1] ?
                            <>
                                <BlogCard type="only-img" descLength={85} data={mostViewedBlogs.data[1]} />
                                {mostViewedBlogs.data[2] ?
                                    <BlogCard type="only-img" descLength={85} data={mostViewedBlogs.data[2]} />
                                    : null
                                    // <CustomCardSkeleton type="only-img" />
                                }
                            </>
                            :
                            <>
                                <CustomCardSkeleton type="only-img" />
                                <CustomCardSkeleton type="only-img" />
                            </>
                        }
                    </div>
                </div>
            </div>
            <div className="blog-container mt-2 mb-3">
                <div className="row cards-row">
                    <div className="section-heading">
                        <span className="sec-subtitle"> Recent</span>
                        <span className="sec-heading">Blogs</span>
                    </div>
                    {allBlogsData && allBlogsData.data.length > 0 && blogs.length > 0 ?
                        blogs.map((item, index) => <BlogCard key={index} type="normal" data={item} />)
                        :
                        [...new Array(8)].map((item, index) => <CustomCardSkeleton key={index} />)
                    }
                    {allBlogsData && allBlogsData.data.length > 0 && blogs.length > 0 && is_more_data &&
                        <div className="col-12 my-3 text-center">
                            <button onClick={viewMore} className="primary-btn cs-btn">View more</button>
                        </div>}
                </div>
                {allCategories && allCategories.data?.length > 0 &&
                    <div className="row my-4">
                        <div className="col-12">
                            <Typography className="mb-3" variant="h4" color="inherit">All Categories</Typography>
                            {allCategories.data.map((category,ind) => (
                                <Chip
                                    key={ind}
                                    className="m-2 cursor-pointer chip-Links"
                                    variant="outlined"
                                    component={Link}
                                    to={`/blog/category/${category.id}`}
                                    label={category.title}
                                />
                            ))}
                        </div>
                    </div>}
                <div className="row cards-row">
                    <div className="section-heading">
                        <span className="sec-subtitle"> Most</span>
                        <span className="sec-heading">Featured</span>
                    </div>
                    {featuredBlogs && featuredBlogs.data.length > 0 ?
                        featuredBlogs.data.map((item, index) => <BlogCard key={index} type="normal" data={item} />)
                        :
                        [...new Array(8)].map((item, index) => <CustomCardSkeleton key={index} />)
                    }
                </div>

            </div>
        </>
    )
}

export default Blogs;

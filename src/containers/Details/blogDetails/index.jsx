import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import { BlogDetailSkeleton, CustomCardSkeleton } from "utils/skeleton";
import { Typography, Chip, Avatar, Card, IconButton } from "@material-ui/core";
import { Visibility } from "@material-ui/icons";
import { Link } from "react-router-dom";
import { useDataContext } from "context/DataContext";
import { useNotifyContext } from "context/notifyContext";
import BlogCard from "utils/blogCard";
import ShareDropdown from "utils/ShareDropdown";
import ReactHtmlParser from "react-html-parser";
import draftToHtml from 'draftjs-to-html';
import { db } from "config/firebase";
import CommentArea from "components/commentsArea/CommentArea";
import { Helmet } from "react-helmet";
import SEO from "context/SEO";

const BlogDetails = (props) => {
    let blogID = props.match.params.id;
    const [blogDetails, setBlogDetails] = useState({});
    const [loaded, setLoaded] = useState(false);
    const [relatedLoaded, setRelatedLoaded] = useState(false);
    const [relatedBlogs, setRelatedBlogs] = useState([]);
    const { mostViewedBlogs, full_blogs_data, allCategories, } = useDataContext();
    const [categoryDetails, setCategoryDetails] = useState({})
    const [userData, setUserData] = useState({})
    const [open, setOpen] = useState(false);
    const { set_notify } = useNotifyContext();

    useEffect(()=> {
        if(blogID && blogDetails?.title){
            let filterViews = blogDetails.views?.toString()?.replace(/\D/g, ''); ;
            let newViews = parseInt(filterViews || 0)
            // console.log(newViews)
            // toggleStar(db.ref(`blogs/${blogID}`),newViews +1 )

            db.ref('blogs').child(blogID).update({
                views: newViews + 1
            })
        }
    },[blogID,blogDetails])
    // make transition with db on every like or unlike post 
    // function toggleStar(postRef,newViews) {
    //     db.ref(`blogs/${blogID}`).transaction(function (post) {
    //         if (post) {

    //             // if (post.stars && post.stars[uid]) {
    //             //     post.starCount--;
    //                 post.views = blogDetails.views +1;
    //             // } else {
    //             //     post.starCount++;
    //             //     if (!post.stars) {
    //             //         post.stars = {};
    //             //     }
    //             //     post.stars[uid] = true;
    //             // }
    //         }
    //         return post;
    //     });
    // };
    useEffect(() => {
        // console.clear();

        // 
        // let twitter_title = document.querySelector("meta[property='twitter:title']");
        // let meta_title = document.querySelector("meta[property='og:title']");
        // let title = document.querySelector("meta[name=title]");
        // 
        // let meta_url = document.querySelector('meta[name=url]');
        // let og_url = document.querySelector("meta[property='og:url']");
        // 
        // let meta_description = document.querySelector('meta[name=description]');
        // let og_description = document.querySelector("meta[property='og:description']");

        // 
        // let meta_type = document.querySelector('meta[name=type]');

        // 
        // let meta_img = document.querySelector('meta[name=image]');
        // let og_img = document.querySelector("meta[property='og:image']");
        // let twitter_image = document.querySelector("meta[property='twitter:image']");

        // 
        // let meta_keywords = document.querySelector('meta[name=keywords]');

        // 
        if (blogDetails) {
            // 
            // document.title = blogDetails?.title || 'Smash-Code';
            // 
            // meta_title?.setAttribute('content', blogDetails?.title);
            // twitter_title?.setAttribute('content', blogDetails?.title);
            // title?.setAttribute('content', blogDetails?.title);

            //    
            // meta_url?.setAttribute('content', 'https://smash-code.com/blog/' + blogDetails?.id);
            // og_url?.setAttribute('content', 'https://smash-code.com/blog/' + blogDetails?.id);
            // 

            // meta_description?.setAttribute('content', blogDetails?.description);
            // og_description?.setAttribute('content', blogDetails?.description);
            // 

            // meta_type?.setAttribute('content', blogDetails?.category?.title || "blogs");
            // 

            // meta_img?.setAttribute('content', blogDetails?.blog_img);
            // og_img?.setAttribute('content', blogDetails?.blog_img);
            // twitter_image?.setAttribute('content', blogDetails?.blog_img);
            //    

            // meta_keywords?.setAttribute('content', blogDetails?.tags?.toString());
        }
    }, [blogDetails]);


    // blog Data
    useEffect(() => {
        if (blogID) {
            if (full_blogs_data && full_blogs_data.data.length > 0) {
                let finedData = full_blogs_data.data.filter((blog) => blog.id === blogID);
                setBlogDetails(finedData[0]);
                setLoaded(true);
            }
        } else {
            setTimeout(() => {
                setLoaded(true);
                set_notify({ open: true, msg: "Blog not find.", type: "info" })
            }, 7000);
        };
    }, [blogID, full_blogs_data]);

    // blog category details
    useEffect(() => {
        if (allCategories && blogDetails && Object.keys(blogDetails).length > 0 && allCategories.categoriesLoaded && allCategories.data.length > 0) {
            let fil_ter_cate = allCategories.data.filter(category => category.id === blogDetails.category?.id);
            setCategoryDetails(fil_ter_cate[0] || {});
        }
    }, [allCategories, blogDetails]);

    // blog user data
    useEffect(() => {
        if (blogDetails && Object.keys(blogDetails).length > 0 && blogDetails?.done_by?.uid) {
            db.ref('users').child(blogDetails.done_by.uid).get().then((snap) => {
                if (snap.exists()) {
                    setUserData(snap.val());
                }
            });
        }
    }, [blogDetails]);

    // related ITem
    useEffect(() => {
        if (blogDetails && full_blogs_data.allBlogsLoaded && full_blogs_data.data.length > 0) {
            let arrOfRel = [];
            let data = full_blogs_data.data;
            function category(tag) {
                return data.filter(function (product) {
                    if (product?.tags) {
                        if (~product.tags.indexOf(tag) && product.id !== blogDetails.id) return product;
                    } else {
                        return
                    }
                });
            }

            if (blogDetails.tags) {
                blogDetails.tags.forEach(tag => {
                    category(tag)?.forEach(s => {
                        arrOfRel.push(s)
                    });
                });
                setRelatedBlogs([...new Set(arrOfRel)])
                setRelatedLoaded(true)
            }

        }
        setTimeout(() => {
            !relatedLoaded && setRelatedLoaded(true)
        }, 5000);
    }, [blogDetails, full_blogs_data])

    // const options1 = {
    //     decodeEntities: true,
    //     transform
    // };

    // const [editorState, setEditorState] = useState(() => EditorState.createEmpty(),);
    // const  [convertedContent, setConvertedContent] = useState(null);

    // const convertContentToHTML = () => {
    //     let currentContentAsHTML = convertToHTML(editorState.getCurrentContent());
    //     setConvertedContent(currentContentAsHTML);
    //   }
    // useEffect(() => {
    //     if (blogDetails?.body) {
    //         let bodyData = JSON.parse(blogDetails.body);
    //         setEditorState(EditorState.createWithContent(convertFromRaw(bodyData)));


    //     } else {
    //         setEditorState(EditorState.createEmpty());
    //     }
    // }, [blogDetails]);

    // function transform(node, index) {
    //     // if (node.type === "tag" && node.name === "figure") {
    //     //     return  <figure><img src="" alt="" />
    //     //     </figure>
    //     //   }
    //     // return null to block certain elements
    //     // don't allow <span> elements
    //     if (node.type === "tag" && node.name === "span") {
    //       return null;
    //     }

    //     // Transform <ul> into <ol>
    //     // A node can be modified and passed to the convertNodeToElement function which will continue to render it and it's children
    //     if (node.type === "tag" && node.name === "ul") {
    //       node.name = "ol";
    //       return convertNodeToElement(node, index, transform);
    //     }

    //     // return an <i> element for every <b>
    //     // a key must be included for all elements
    //     if (node.type === "tag" && node.name === "b") {
    //       return <i key={index}>{processNodes(node.children, transform)}</i>;
    //     }

    //     // all links must open in a new window
    //     if (node.type === "tag" && node.name === "a") {
    //       node.attribs.target = "_blank";
    //       // console.log(node);
    //       // console.log(index);
    //       return convertNodeToElement(node, index, transform);
    //     }

    //     if (node.type === "tag" && node.name === "button") {
    //       return (
    //         <Button variant="contained" color="primary" key={index}>
    //           {processNodes(node.children, transform)}
    //         </Button>
    //       );
    //     }
    //   }

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
    // const share = () => {
    //     let url =
    //         'https://www.facebook.com/sharer.php?display=popup&u=' +
    //         encodeURI('https://www.smash-code.com');
    //     //    + blogDetails?.id;
    //     let options = 'toolbar=0,status=0,resizable=1,width=750,height=480';
    //     window.open(url, 'sharer', options);
    // }

    return (
        <>
            <SEO
                description={blogDetails?.description}
                // meta={''}
                title={blogDetails?.title}
                pageUrl={window.location?.href}
                image={blogDetails?.blog_img}
            />
            <div className="blog-container">
                <Helmet>
                    <meta charSet="utf-8" />
                    <meta name="title" content={blogDetails?.title || "Smash-Code"} />
                    <meta name="description" content={blogDetails?.description || ""} />
                    <meta name="keywords" content={blogDetails?.tags?.toString() || ''} />
                    <meta name="image" content={blogDetails?.blog_img || "https://firebasestorage.googleapis.com/v0/b/blogs-smash-code.appspot.com/o/uploads%2Fmedia%2FmainLogo.png-Mowiyb46OT8mTRi0rL2?alt=media&token=0557ccc8-f66e-47ed-80f7-8b64a270fbfa"} />
                    <title>{blogDetails?.title || "Smash-Code"}</title>
                    <meta property="og:image" content={blogDetails?.blog_img || "https://firebasestorage.googleapis.com/v0/b/blogs-smash-code.appspot.com/o/uploads%2Fmedia%2FmainLogo.png-Mowiyb46OT8mTRi0rL2?alt=media&token=0557ccc8-f66e-47ed-80f7-8b64a270fbfa"} />
                    <meta property="og:url" content={window?.location?.href || "https://smash-code.com/blogs"} />
                    <meta property="og:title" content={blogDetails?.title || "Smash-Code"} />
                    <meta property="og:description" content={blogDetails?.description || "Smash-Code"} />
                    <meta property="twitter:site" content={window.location.href || "https://smash-code.com/blogs"} />
                    <meta name="twitter:card" content="summary_large_image" />
                    <meta property="twitter:image" content={blogDetails?.blog_img || "https://firebasestorage.googleapis.com/v0/b/blogs-smash-code.appspot.com/o/uploads%2Fmedia%2FmainLogo.png-Mowiyb46OT8mTRi0rL2?alt=media&token=0557ccc8-f66e-47ed-80f7-8b64a270fbfa"} />
                    <meta property="twitter:title" content={blogDetails?.title || "Smash-Code"} />
                </Helmet>

                {/* <button onClick={toggleStar}>Share to Workplace</button> */}
                {loaded ?
                    <>
                        <div className="row">
                            <div className="mt-3 mb-3">
                                Category: &nbsp;
                                {blogDetails &&
                                    blogDetails.category &&
                                    <Chip
                                    component={Link}
                                        className="mt-sm-0 mt-1 cursor-pointer"
                                        to={`/blog/category/${blogDetails.category?.id}`}
                                        variant="outlined" label={categoryDetails ? categoryDetails.title : "Category"} style={{ fontSize: "17px" }} />}
                            </div>
                            <div className="col-lg-8 col-12">
                                <div className="py-3">
                                    <Typography className="detail-blog-title" variant="h1" color="inherit">{blogDetails?.title}</Typography>
                                </div>
                                <div className="d-flex justify-content-between align-items-center">
                                    <div className="d-flex justify-content-start align-items-center">
                                        <Avatar width={40} height={40} src={userData?.profile} alt={userData.user_name} />
                                        <div className="px-3">
                                            <Typography variant="body1" color="inherit">{blogDetails?.done_by?.user_name || userData?.user_name || "UnKnown"}</Typography>
                                            <Typography variant="body2" className="text-muted">{blogDetails?.post_date?.slice(0, 11)}</Typography>
                                        </div>
                                    </div>
                                    <div className="ml-auto d-flex justify-content-end align-items-center">
                                        <Visibility /> &nbsp;
                                        <Typography variant="subtitle1" className="text-muted">
                                            &nbsp;{blogDetails && blogDetails?.views &&
                                                nFormatter(Number((blogDetails.views + 1)?.toString().replaceAll(",", '') || 0))
                                            } views
                                        </Typography>
                                    </div>
                                </div>
                                <div className="my-2 detail-blog-img-wraps text-center"
                                // style={{ backgroundImage: 
                                // `url(${blogDetails?.blog_img || ""})` }
                                // }
                                >
                                    <img src={blogDetails?.blog_img || "smash-code"} alt="" />
                                </div>
                            </div>
                            <div className="col-lg-4 col-12 pt-3">
                                <Card className="border border-secondary bg-transparent ">
                                    <div className="p-2 border-bottom">
                                        <Typography variant="h6">Trending Posts</Typography>
                                    </div>
                                    <div className="trending-post-card-body">
                                        {mostViewedBlogs.data.length > 0 ? mostViewedBlogs.data.slice(0, 25).map((tr, i) => (
                                            <Link key={i} to={`/blog/${tr.id}`}
                                                className="trending-item d-flex flex-wrap">
                                                <div className="col-2">
                                                    <Avatar width={30} height={30} src={tr?.blog_img} alt={tr?.category?.title?.slice(0, 1) || "."} />
                                                </div>
                                                <div className="col-10">
                                                    <Typography variant="subtitle1">{tr.title}</Typography>
                                                </div>
                                                <div className="col-12">
                                                    <Typography variant="body1" className="text-muted text-right w-100">{tr.post_date}</Typography>
                                                </div>
                                            </Link>
                                        ))
                                            :
                                            <Typography className="p-3">
                                                No Trending Posts yet...
                                            </Typography>
                                        }
                                    </div>
                                </Card>
                                {blogDetails && blogDetails.title &&
                                    <div className="my-2 d-flex justify-content-between align-items-center p-2">
                                        <p className="text-muted m-0">Share If You Care. </p>
                                        <IconButton
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setOpen(e.currentTarget);
                                            }}
                                            color="secondary" className="float-right">
                                            <svg width="21px" height="21px" viewBox="0 0 1024 1024"
                                                fill="var(--primary)">
                                                <path d="M768 853.333c-47.104 0-85.333-38.229-85.333-85.333s38.229-85.333 85.333-85.333c47.104 0 85.333 38.229 85.333 85.333s-38.229 85.333-85.333 85.333zM256 597.333c-47.104 0-85.333-38.229-85.333-85.333s38.229-85.333 85.333-85.333c47.104 0 85.333 38.229 85.333 85.333s-38.229 85.333-85.333 85.333zM768 170.667c47.104 0 85.333 38.229 85.333 85.333s-38.229 85.333-85.333 85.333c-47.104 0-85.333-38.229-85.333-85.333s38.229-85.333 85.333-85.333zM768 597.333c-52.437 0-98.688 24.107-130.005 61.312l-213.675-123.392c1.067-7.637 2.347-15.275 2.347-23.253 0-4.779-1.024-9.259-1.408-13.909l218.283-126.037c31.104 33.408 75.179 54.613 124.459 54.613 94.251 0 170.667-76.416 170.667-170.667s-76.416-170.667-170.667-170.667c-94.251 0-170.667 76.416-170.667 170.667 0 14.208 2.261 27.819 5.504 41.003l-205.867 118.912c-30.763-45.013-82.389-74.581-140.971-74.581-94.251 0-170.667 76.416-170.667 170.667s76.416 170.667 170.667 170.667c55.467 0 104.235-26.88 135.424-67.84l209.195 120.747c-2.048 10.539-3.285 21.333-3.285 32.427 0 94.251 76.416 170.667 170.667 170.667s170.667-76.416 170.667-170.667c0-94.251-76.416-170.667-170.667-170.667z"></path>
                                            </svg>
                                        </IconButton>
                                        <ShareDropdown
                                            onClick={(e) => {
                                                e.preventDefault();
                                            }}
                                            handleClose={() => setOpen(null)}
                                            open={open}
                                            url={window.location.href}
                                            twitter_url={`${window.location.href}&title=${blogDetails.title}&image=${blogDetails.blog_img}`}
                                        // twitter_url={window.location.href}
                                        />
                                    </div>
                                }
                            </div>
                            <div className="col-12 mt-4 border-top pt-4 blog-page-desc">
                                {blogDetails && blogDetails.body &&
                                    ReactHtmlParser(draftToHtml(JSON.parse(blogDetails.body)))
                                }
                            </div>
                            {blogDetails && blogDetails.tags && blogDetails.tags.length > 0 &&
                                <div className="col-12 my-3">
                                    {blogDetails.tags.map((tag, ind) => (
                                        <Chip 
                                        className="m-2 cursor-pointer"
                                        component={Link} 
                                        to={`/blog/category/${blogDetails.category?.id}`}
                                        key={ind} 
                                        label={tag}
                                        variant="outlined"
                                        />
                                    ))}
                                </div>
                            }
                            <div className="col-12"></div>
                        </div>
                        {blogDetails &&
                            <CommentArea data={blogDetails} />
                        }
                        <RelatedSection currentBlog={blogDetails} relatedBlogs={relatedBlogs} relatedLoaded={relatedLoaded} />
                        {/* {allCategories && allCategories.data?.length > 0 &&
                        <div className="row my-4">
                            <div className="col-12">
                                <Typography className="mb-3" variant="h4" color="inherit">All Categories</Typography>
                                {allCategories.data.map((category,i) => (
                                    <Chip
                                    key={i}
                                        className="m-2 cursor-pointer chip-Links"
                                        variant="outlined"
                                        component={Link}
                                        to={`/blog/category/${category.id}`}
                                        label={category.title}
                                    />
                                ))}
                            </div>
                        </div>} */}
                    </>
                    :
                    <>
                        <BlogDetailSkeleton />
                        <RelatedSection />
                    </>
                }
            </div>
        </>

    )
};


const RelatedSection = ({ relatedBlogs, relatedLoaded, currentBlog }) => {
    return (
        <>
            <div className="row cards-row mt-5">
                <div className="section-heading">
                    <span className="sec-subtitle"> Related </span>
                    <span className="sec-heading">Blogs</span>
                </div>
                {relatedBlogs && relatedBlogs.length > 0 ?
                    relatedBlogs.map((item, i) => <BlogCard key={i} type="normal" data={item} />)
                    :
                    relatedLoaded ?
                        <p>No related Blogs.</p>
                        :
                        [0, 1, 2, 3].map((itm, i) => <CustomCardSkeleton key={i} />)

                }
            </div>
        </>
    )
}

const mapStateToProps = (store) => ({
    allBlogs: store.allBlogs,
    allCategories: store.allCategories,
});

export default connect(mapStateToProps, null)(withRouter(BlogDetails));

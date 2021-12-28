import { useState, useEffect } from 'react'
import { StarBorder, Star, Sms, Send, Delete } from "@material-ui/icons";
import { IconButton, CircularProgress, Avatar, MenuItem, FormControl, Select, Button } from "@material-ui/core";
import { useAuthContext } from 'context/AuthContext';
import { useNotifyContext } from 'context/notifyContext';
import { db } from 'config/firebase';
import PublicLoginModel from 'components/loginModel/PublicLoginModel';
import Moment from "moment";
import ShareDropdown from "utils/ShareDropdown";
import { getSortByTransactionDate } from "store/action";


const CommentArea = ({ data }) => {
    const { state } = useAuthContext();
    const { set_notify } = useNotifyContext();
    const [loginModel, setLoginModel] = useState(false);
    const [commentForm, setCommentForm] = useState({ msg: "" });
    const [postingComment, setPostingComment] = useState(false);
    const [showComments, setShowComments] = useState(true);
    const [shareMenu, setShareMenu] = useState(false);
    const [commentMode, setCommentMode] = useState(0);
    const [filteredComments, setFilteredComments] = useState([]);
    let { id, stars, starCount, comments } = data;

    // Like Function
    const LikeBlog = async () => {
        if (id) {
            if (state.isAuthenticated && Object.keys(state.user).length > 0) {
                toggleStar(db.ref(`blogs/${id}`), state.user.uid)
            } else {
                setLoginModel(true);
            }
        } else {
            set_notify({ open: true, msg: "something went wrong while posting your review.", type: "error" })

        }
    };
    // make transition with db on every like or unlike post 
    function toggleStar(postRef, uid) {
        postRef.transaction(function (post) {
            if (post) {
                if (post.stars && post.stars[uid]) {
                    post.starCount--;
                    post.stars[uid] = null;
                } else {
                    post.starCount++;
                    if (!post.stars) {
                        post.stars = {};
                    }
                    post.stars[uid] = true;
                }
            }
            return post;
        });
    };
    // =============================
    // add a comment
    const AddComment = (e) => {
        e.preventDefault();
        if (state.isAuthenticated && Object.keys(state.user).length > 0) {
            if (id) {
                setPostingComment(true);
                let comment_id = db.ref('blogs').child(id).push().key;
                db.ref('blogs').child(id).child(`comments/${comment_id}`).set({
                    uid: state.user.uid || "",
                    comment_id: comment_id || "",
                    user_name: state.user.user_name || "",
                    email: state.user.email || "",
                    profile: state.user.profile || "",
                    post_date: Moment().format('MM-DD-YYYY  HH:m:s'),
                    msg: commentForm.msg || "",
                }).then(() => {
                    setCommentForm({ msg: "" });
                    setPostingComment(false);
                    set_notify({ open: true, msg: "Comment posted successfully", type: "success" })
                }).catch((err) => {
                    setPostingComment(false);
                    set_notify({ open: true, msg: "something went wrong while posting your comment.", type: "error" })
                    console.log(err.message)
                });
            } else {
                set_notify({ open: true, msg: "something went wrong while posting your comment.", type: "error" })
            }
        } else {
            setLoginModel(true);
        }
    };
    const handleCommentTypes = (e) => {
        setCommentMode(e.target.value);
    };
    // comments filter
    useEffect(() => {
        let allComments = comments && Object.values(comments) || [];
        if (allComments && allComments.length > 0) {
            if (commentMode === 0) {
                setFilteredComments(allComments.sort(getSortByTransactionDate))
            } else if (commentMode === 2) {
                if (state.user.uid) {
                    setFilteredComments(allComments.sort(getSortByTransactionDate).filter((cmt) => cmt.uid === state.user.uid))
                } else {
                    setFilteredComments([])
                }

            } else {
                setFilteredComments(allComments)
            }
        }
    }, [comments, commentMode, state.user]);

    return (
        <section>
            <div className="row mt-4">
                <div className="col-12 d-flex flex-wrap justify-content-between align-items-center">
                    <div className="like-comment-btn-wrapper">
                        <button onClick={LikeBlog}
                            className={
                                `
                        d-flex like-comment-btn like-btn
                        ${stars && stars[state?.user?.uid] && 'liked' || ''}
                        `}
                        >
                            {stars && stars[state?.user?.uid] ?
                                <Star className="cursor-pointer cmnt-icons " />
                                :
                                <StarBorder className=" cmnt-icons cursor-pointer" />
                            }
                            <p className="mx-1">
                                {starCount || 0}  Likes
                            </p>
                        </button>
                        <button
                            onClick={() => setShowComments(!showComments)}
                            className="d-flex like-comment-btn cmnt-btn">
                            <Sms className="cursor-pointer mt-1 cmnt-icons " />
                            <p className="mx-1">
                                {comments && Object.keys(comments).length} comments
                            </p>
                        </button>
                    </div>
                    <div className="text-right bottom-share-btn mt-3">
                        <Button
                            variant="outlined"
                            startIcon={
                                <svg width="21px" height="21px" viewBox="0 0 1024 1024"
                                    fill="var(--primary)">
                                    <path d="M768 853.333c-47.104 0-85.333-38.229-85.333-85.333s38.229-85.333 85.333-85.333c47.104 0 85.333 38.229 85.333 85.333s-38.229 85.333-85.333 85.333zM256 597.333c-47.104 0-85.333-38.229-85.333-85.333s38.229-85.333 85.333-85.333c47.104 0 85.333 38.229 85.333 85.333s-38.229 85.333-85.333 85.333zM768 170.667c47.104 0 85.333 38.229 85.333 85.333s-38.229 85.333-85.333 85.333c-47.104 0-85.333-38.229-85.333-85.333s38.229-85.333 85.333-85.333zM768 597.333c-52.437 0-98.688 24.107-130.005 61.312l-213.675-123.392c1.067-7.637 2.347-15.275 2.347-23.253 0-4.779-1.024-9.259-1.408-13.909l218.283-126.037c31.104 33.408 75.179 54.613 124.459 54.613 94.251 0 170.667-76.416 170.667-170.667s-76.416-170.667-170.667-170.667c-94.251 0-170.667 76.416-170.667 170.667 0 14.208 2.261 27.819 5.504 41.003l-205.867 118.912c-30.763-45.013-82.389-74.581-140.971-74.581-94.251 0-170.667 76.416-170.667 170.667s76.416 170.667 170.667 170.667c55.467 0 104.235-26.88 135.424-67.84l209.195 120.747c-2.048 10.539-3.285 21.333-3.285 32.427 0 94.251 76.416 170.667 170.667 170.667s170.667-76.416 170.667-170.667c0-94.251-76.416-170.667-170.667-170.667z"></path>
                                </svg>
                            }
                            onClick={(e) => {
                                e.preventDefault();
                                setShareMenu(e.currentTarget);
                            }}
                            color="secondary"
                            className="float-right text-capitalize">
                            <p className="m-0">Sharing is caring</p>
                        </Button>
                        <ShareDropdown
                            onClick={(e) => {
                                e.preventDefault();
                            }}
                            handleClose={() => setShareMenu(null)}
                            open={shareMenu}
                            url={`${window.location.host}/blog/${id}`}
                            twitter_url= {`${window.location.host}/blog/${id}&title=${data?.title}&image=${data?.blog_img}`}
                        />
                    </div>
                </div>
                <div className="col-12">
                    {showComments &&
                        <div className="comments-wrapper">
                            <div className="comment-top-area">
                                <form onSubmit={AddComment} className="add-comment-area">
                                    <div className="user-profile">
                                        <Avatar src={state.user.profile} alt={state.user.user_name} />
                                    </div>
                                    <div className="input-area">
                                        <input
                                            type="text"
                                            placeholder="Submit your comment.."
                                            onChange={(e) => setCommentForm({ msg: e.target.value })}
                                            value={commentForm.msg} />
                                        {postingComment &&
                                            <CircularProgress size={22} />}&nbsp;
                                    </div>
                                    <div className="send-comment-area">
                                        <IconButton

                                            disabled={
                                                !postingComment &&
                                                    commentForm.msg?.trim().length > 0 ? false
                                                    : true
                                            }
                                            type="submit">
                                            <Send />
                                        </IconButton>
                                    </div>
                                </form>
                                <div className="w-100 pt-3 pb-3 pb-1 px-2">
                                    <FormControl variant="outlined" size="small">
                                        <Select
                                            value={commentMode}
                                            onChange={handleCommentTypes}
                                        >
                                            <MenuItem value={0}>Newest</MenuItem>
                                            <MenuItem value={1}>All Comments</MenuItem>
                                            <MenuItem value={2}>My Comments</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>
                            </div>
                            <div className="all-comment-wrapper-bottom">
                                {comments && filteredComments.length > 0 ?
                                    filteredComments.map((comment, i) => (
                                        <CommentDisplayBox key={i}
                                            blogData={data}
                                            commentData={comment}
                                        />
                                    ))
                                    :
                                    <div className="no-comments px-3 text-center py-4">
                                        <h4>No comments yet!</h4>
                                    </div>
                                }
                            </div>
                        </div>
                    }
                </div>
            </div>
            <PublicLoginModel loginModel={loginModel} setLoginModel={setLoginModel} />
        </section>
    )
};


const CommentDisplayBox = ({ commentData, blogData }) => {
    const { state } = useAuthContext();
    const { set_notify } = useNotifyContext();
    const [replayFormData, setReplayFormData] = useState({ msg: "" });
    const [postingReplay, setPostingReplay] = useState(false);
    const [replayForm, setReplayForm] = useState(false);
    // replay
    const replayOnComment = (e) => {
        e.preventDefault();
        setPostingReplay(true);
        let newKey = db.ref('blogs').child(blogData.id).child('comments')
            .child(commentData.comment_id).child('replays').push().key;
        db.ref('blogs').child(blogData.id).child('comments')
            .child(commentData.comment_id).child('replays').set({
                [newKey]: {
                    replay: replayFormData.msg,
                    replay_id: newKey,
                    user_name: state.user.user_name || "",
                    uid: state.user.uid || "",
                    profile: state.user.profile || "",
                    post_date: Moment().format('MM-DD-YYYY  HH:m:s'),
                }
            })
            .then(() => {
                setPostingReplay(false);
                setReplayForm(false);
                setReplayFormData({ msg: "" });
                set_notify({ open: true, msg: "replay posted successfully.", type: "success" })
            }).catch((err) => {
                setPostingReplay(false);
                console.error(err);
                set_notify({ open: true, msg: "something went wrong while posting your replay.", type: "error" })
            });
    };

    useEffect(() => {
        if (commentData && blogData && commentData.replays) {
            let prevData = Object.values(commentData.replays)[0];
            setReplayFormData({ msg: prevData.replay })
        } else {
            setReplayFormData({ msg: '' })
        }
    }, [commentData, blogData])
    return (
        <div className={`comment-box ${commentData.uid === state.user.uid ? 'my-comment' : ''}`}>
            <div className="review-left">
                <Avatar
                    classes={{
                        root: 'user-comment-img',
                        fallback: 'avatar-svg'
                    }}
                    src={commentData.profile} alt={commentData.user_name || "unKnown"} />
            </div>
            <div className="review-right">
                <div className="review-user-name">
                    <span>{commentData.user_name || "unKnown"}</span>
                </div>
                <div className="review-body">
                    <p>{commentData.msg}</p>
                    <div className="replay-sec-top">
                        {state.user && state.user.admin ?
                            <button onClick={() => setReplayForm(!replayForm)} className="text-lowercase replay-btn">
                                {commentData?.replays ? 'update replay' : 'replay'}
                            </button>
                            :
                            commentData?.replays ?
                                <button className="text-lowercase replay-btn only-read">
                                    replays
                                </button>
                                : null

                        }
                        <div className="review-bottom">
                            <span>{commentData.post_date?.slice(0, 10)}</span>
                        </div>
                    </div>

                    {state.user && state.user.admin && replayForm &&
                        <form onSubmit={replayOnComment} className="replay-sec-form-sec">
                            <textarea
                                name="replay"
                                rows="3"
                                placeholder="post your replay"
                                onChange={(e) => setReplayFormData({ msg: e.target.value })}
                                value={replayFormData.msg}
                            >
                            </textarea>
                            <div className="w-100 mt-2 text-right">
                                <Button
                                    variant="text"
                                    color="primary"
                                    endIcon={
                                        postingReplay ?
                                            <CircularProgress size={23} />
                                            : <Send />
                                    }
                                    disabled={
                                        !postingReplay &&
                                            replayFormData.msg?.trim().length > 0 ? false
                                            : true
                                    }
                                    type="submit"
                                >
                                    Post
                                </Button>
                            </div>
                        </form>
                    }
                    {commentData?.replays &&
                        Object.values(commentData.replays).map((rep, ind) => (
                            <NestedReplay key={ind} nestedReplayData={rep} />
                        ))
                    }
                </div>
            </div>

        </div>
    )
};


const NestedReplay = ({ nestedReplayData }) => {
    return (
        <div className={`comment-box`}>
            <div className="review-left">
                <Avatar
                    classes={{
                        root: 'user-comment-img',
                        fallback: 'avatar-svg'
                    }}
                    src={nestedReplayData.profile}
                    alt={nestedReplayData.user_name || "unKnown"}
                />
            </div>
            <div className="review-right">
                <div className="review-user-name">
                    <span>{nestedReplayData.user_name || "unKnown"}</span>
                </div>
                <div className="review-body">
                    <p>{nestedReplayData.replay}</p>
                </div>
            </div>
        </div>
    )
}



export default CommentArea

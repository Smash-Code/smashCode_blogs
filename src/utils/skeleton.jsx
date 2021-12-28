import {
    Typography,
    Card,
    IconButton,
    CardActions
} from "@material-ui/core";
import {
    Visibility,
} from "@material-ui/icons";
import { Skeleton } from "@material-ui/lab";


export const CustomCardSkeleton = ({ type }) => {
    if (type === "only-img") {
        return (
            <Card sx={{ maxWidth: 345 }} className="mb-3">
                <div className="a-white  overflow-hidden position-relative text-white text-decoration-none" >
                    <Skeleton variant="rect" width={"100%"} height={207} />
                    <div className="img-card-content p-3">
                        <Skeleton variant="rect" width={"100%"} height={100} />
                        <Skeleton
                            animation="wave"
                            height={50}
                            width="100%"
                        />
                        <Skeleton animation="wave" height={14} width="99%" />
                        <Skeleton animation="wave" height={14} width="100%" />
                        <Skeleton animation="wave" height={14} width="55%" />
                    </div>
                </div>
            </Card>
        )
    }
    return (
        <Card className="cs-blog-card d-flex flex-column justify-content-start">
            <div>
                <Skeleton variant="rect" width={"100%"} height={180} />
            </div>
            <div className="my-2 px-2">
                <Skeleton
                    animation="wave"
                    height={20}
                    width="100%"
                />
                <Skeleton
                    animation="wave"
                    height={20}
                    width="70%"
                    style={{ marginBottom: 6 }}
                />
                <Skeleton animation="wave" height={14} width="99%" />
                <Skeleton animation="wave" height={14} width="92%" />
                <Skeleton animation="wave" height={14} width="49%" />
            </div>
            <CardActions className="border-top border-secondary d-flex justify-content-between align-items-center">
                <IconButton
                    color="secondary" className="float-right">
                    <svg width="21px" height="21px" viewBox="0 0 1024 1024"
                        fill="var(--primary)">
                        <path d="M768 853.333c-47.104 0-85.333-38.229-85.333-85.333s38.229-85.333 85.333-85.333c47.104 0 85.333 38.229 85.333 85.333s-38.229 85.333-85.333 85.333zM256 597.333c-47.104 0-85.333-38.229-85.333-85.333s38.229-85.333 85.333-85.333c47.104 0 85.333 38.229 85.333 85.333s-38.229 85.333-85.333 85.333zM768 170.667c47.104 0 85.333 38.229 85.333 85.333s-38.229 85.333-85.333 85.333c-47.104 0-85.333-38.229-85.333-85.333s38.229-85.333 85.333-85.333zM768 597.333c-52.437 0-98.688 24.107-130.005 61.312l-213.675-123.392c1.067-7.637 2.347-15.275 2.347-23.253 0-4.779-1.024-9.259-1.408-13.909l218.283-126.037c31.104 33.408 75.179 54.613 124.459 54.613 94.251 0 170.667-76.416 170.667-170.667s-76.416-170.667-170.667-170.667c-94.251 0-170.667 76.416-170.667 170.667 0 14.208 2.261 27.819 5.504 41.003l-205.867 118.912c-30.763-45.013-82.389-74.581-140.971-74.581-94.251 0-170.667 76.416-170.667 170.667s76.416 170.667 170.667 170.667c55.467 0 104.235-26.88 135.424-67.84l209.195 120.747c-2.048 10.539-3.285 21.333-3.285 32.427 0 94.251 76.416 170.667 170.667 170.667s170.667-76.416 170.667-170.667c0-94.251-76.416-170.667-170.667-170.667z"></path>
                    </svg>
                </IconButton>
                <div className="d-flex justify-content-end align-items-center col-6 ml-auto">
                    <Typography variant="body2">
                        <Visibility style={{ fontSize: "18px" }} /> &nbsp;
                    </Typography>
                    <Skeleton animation="wave" height={22} width="35%" />
                </div>
            </CardActions>
        </Card>
    );
};
export const CustomBigCardSkeleton = () => {
    return (
        <Card className="big-card-wrapper text-decoration-none a-white d-flex flex-column justify-content-end align-items-end">
            <div>
                <Skeleton variant="rect" width={"100%"} height={180} />
            </div>

            <Typography variant="h6" className="px-2 d-flex justify-content-center align-items-center"><Visibility /> &nbsp;
                <Skeleton style={{ minWidth: "55px" }} animation="wave" height={14} width="45%" />
            </Typography>
            <div className="big-blog-bottom">
                <Skeleton animation="wave" height={35} width="98%" />
                <Skeleton
                    animation="wave"
                    height={20}
                    width="96%"
                />
                <Skeleton
                    animation="wave"
                    height={20}
                    width="93%"
                    style={{ marginBottom: 6 }}
                />
                <Skeleton
                    animation="wave"
                    height={14}
                    width="68%"
                    style={{ marginBottom: 6 }}
                />
            </div>
            <div className="top-blog-badge">
                <Skeleton animation="wave" height={30} width="92%" style={{ minWidth: "55px" }} />
            </div>
        </Card>
    );
};
export const BlogDetailSkeleton = () => {
    return (
        <div className="row mb-3">
            <div className="col-12">
                <Skeleton variant="text" width={"20%"} height={52} className="rounded" />
            </div>
            <div className="col-lg-8 col-12">
                <div className="mb-2">
                    <Skeleton variant="text" width={"100%"} height={45} className="rounded" />
                    <Skeleton variant="text" width={"70%"} height={45} className="rounded" />
                </div>
                <div className="d-flex w-100 justify-content-between align-items-center">
                    <div className="d-flex justify-content-start align-items-center">
                        <Skeleton variant="circle" width={40} height={40} className="rounded-circle" />
                        <div className="px-3">
                            <Skeleton variant="text" height={10} width="90px" />
                            <Skeleton variant="text" height={10} width="55px" />
                        </div>
                    </div>
                    <div className="ml-auto d-flex justify-content-end align-items-center">
                        <Visibility /> &nbsp;
                        <Skeleton variant="text" height={30} width="85px" />
                    </div>
                </div>
                <div className="my-2">
                    <Skeleton variant="rect" width={"100%"} height={350} className="rounded" />
                </div>
            </div>
            <div className="col-lg-4 col-12">
                <Skeleton variant="rect" width={"100%"} height={70} className="rounded mb-2" />
                <Card className="rounded px-2 py-3">
                    <Skeleton variant="rect" width={"100%"} height={100} className="rounded my-2" />
                    <Skeleton variant="rect" width={"100%"} height={50} className="rounded my-2" />
                    <Skeleton variant="rect" width={"100%"} height={50} className="rounded my-2" />
                    <Skeleton variant="rect" width={"100%"} height={80} className="rounded my-2" />
                    <Skeleton variant="rect" width={"100%"} height={50} className="rounded my-2" />
                </Card>
            </div>
        </div>
    );
};
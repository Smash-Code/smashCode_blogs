import { createContext, useEffect, useState, useContext } from 'react';
import { db } from '../config/firebase'
import { getSortByTransactionDate } from "store/action";

const DataContext = createContext();

const DataContextProvider = ({ children }) => {
    const [allBlogs, setAllBlogs] = useState({ blogsLoaded: false, data: [] });
    const [full_blogs_data, setBlogs_Data] = useState({ allBlogsLoaded: false, data: [] });
    const [mostViewedBlogs, setMostViewedBlogs] = useState({ topBlogsLoaded: false, data: [] });
    const [featuredBlogs, setFeaturedBlogs] = useState({ featuredLoaded: false, data: [] });
    const [allCategories, setAllCategories] = useState({ categoriesLoaded: false, data: [] });
    const [isMoreData, setIsMoreData] = useState(false);

    // all blogs /  categories data
    useEffect(() => {
        db.ref('blogs').limitToLast(24).on('value', (snap) => {
            if (snap.val()) {
                let blogsarry = Object.values(snap.val()).map((data) => data)
                let latestData = blogsarry.sort(getSortByTransactionDate);
                setAllBlogs({
                    blogsLoaded: true, data: latestData
                });
                if(blogsarry.length >11 ){
                    setIsMoreData(false)
                }
            } else {
                setAllBlogs({ blogsLoaded: true, data: allBlogs.data })
            }
        });
        db.ref('categories').on('value', (cate_snap) => {
            if (cate_snap) {
                let cate_array = Object.values(cate_snap.val()).map((data) => data)
                setAllCategories({
                    categoriesLoaded: true, data: cate_array
                })
            } else {
                setAllCategories({ categoriesLoaded: true, data: allCategories.data })
            }
        });
        db.ref('blogs').on('value', (blogs_snap) => {
            if (blogs_snap) {
                let blogs_array = Object.values(blogs_snap.val()).map((data) => data)
                setBlogs_Data({
                    allBlogsLoaded: true, data: blogs_array
                })
            } else {
                setBlogs_Data({ allBlogsLoaded: true, data: full_blogs_data.data })
            }
        });
    }, []);

    // Recent Featured Blogs
    useEffect(() => {
        db.ref('blogs').limitToLast(12).on('value', (snap) => {
            if (snap.val()) {
                let blogsarry = Object.values(snap.val()).map((data) => data)
                let featured_data = blogsarry.sort(getSortByTransactionDate);
                let getFeatured = featured_data.filter((itm) => itm.featured === true);
                setFeaturedBlogs({ featuredLoaded: true, data: getFeatured });
            } else {
                setFeaturedBlogs({ featuredLoaded: true, data: featuredBlogs.data });
            }
        });
    }, []);

    // by recent most views
    useEffect(() => {
        const priceFilter = (vals) => {
            return vals.sort((a, b) => {
                let aValue = a.views?.toString().replaceAll(",", '');
                let bValue = b.views?.toString().replaceAll(",", '');
                return Number(bValue) - Number(aValue);
            });
        }
        db.ref('blogs').orderByChild('views').limitToFirst(12)
            .on('value',(snap) => {
                if (snap.val()) {
                    let blogsarry = Object.values(snap.val()).map((data) => data)
                    let recent = blogsarry.sort(getSortByTransactionDate);
                    setMostViewedBlogs({
                        topBlogsLoaded: true, data: priceFilter(recent)
                    })
                  
                } else {
                    setMostViewedBlogs({ topBlogsLoaded: true, data: mostViewedBlogs.data })
                }
            })
    }, []);
   
    const loadMore = () => {
        db.ref('blogs').limitToLast(allBlogs.data.length + 10).once('value').then((snap) => {
            if (snap) {
                let blogsarry = Object.values(snap.val()).map((data) => data);
                let latestData = blogsarry.sort(getSortByTransactionDate);
                if (latestData.length === allBlogs.data.length) {
                    setIsMoreData(false)
                } else {
                    setAllBlogs({
                        blogsLoaded: true, data: latestData
                    })
                }
            } else {
                setAllBlogs({ blogsLoaded: true, data: allBlogs.data });
            }
        });
    };

    return (
        <DataContext.Provider value={{
            allBlogsData: allBlogs,
            full_blogs_data: full_blogs_data,
            mostViewedBlogs: mostViewedBlogs,
            featuredBlogs: featuredBlogs,
            allCategories: allCategories,
            loadMore: loadMore,
            is_more_data: isMoreData
        }}>
            {children}
        </DataContext.Provider>
    )
};

export const useDataContext = () => useContext(DataContext);

export default DataContextProvider;


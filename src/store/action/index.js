import { db } from "config/firebase";

const get_All_Blogs = () => {
    return (dispatch) => {
        db.ref('blogs').on('value', function(data) {
            if (data.val()) {
                dispatch({ type: "set_blogs_data", payload: {...data.val() } })
            } else {
                dispatch({ type: "set_blogs_data", payload: {} })
            }
        });
    };
}
const get_All_categories = () => {
    return (dispatch) => {
        db.ref('categories').on('value', function(data) {
            if (data.val()) {
                dispatch({ type: "set_categories_data", payload: {...data.val() } })
            } else {
                dispatch({ type: "set_categories_data", payload: {} })
            }
        });
    };
}

// Sort Data who's added recently
function getSortByTransactionDate(a, b) {
    if (a, b) {
        return new Date(b.post_date).valueOf() - new Date(a.post_date).valueOf()
    } else {
        console.log("Did not get array of objects to sorting data check your data and also sorting method....")
    }
};


export {
    getSortByTransactionDate,
    get_All_Blogs,
    get_All_categories,
};
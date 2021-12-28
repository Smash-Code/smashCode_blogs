const INITIAL_STATE = {
    allCategories: {},
    allBlogs: {},
}

const store = (state = INITIAL_STATE, action) => {

    switch (action.type) {
        case "set_categories_data":
            return ({
                ...state,
                allCategories: action.payload
            })
        case "set_blogs_data":
            return ({
                ...state,
                allBlogs: action.payload
            })
        default:
            return (state)
    }
}

export default store;
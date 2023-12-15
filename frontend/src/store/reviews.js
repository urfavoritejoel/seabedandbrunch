import { csrfFetch } from "./csrf";
import { createSelector } from 'reselect';

const GET_REVIEWS_BY_ID = 'reviews/getById';

const getReviewsById = (reviews, spotId) => {
    return {
        type: GET_REVIEWS_BY_ID,
        spotId: spotId,
        payload: reviews
    }
};

export const getReviewsByIdThunk = (spotId) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`);
    const data = await res.json();
    dispatch(getReviewsById(data.Reviews, spotId));
}

const selectReviews = (state) => state.reviews;
export const selectReviewsArray = createSelector(selectReviews, (reviews) => Object.values(reviews));

const initialState = {};

const reviewsReducer = (state = initialState, action) => {
    let newState = { ...state };
    switch (action.type) {
        case GET_REVIEWS_BY_ID:
            console.log(action.payload);
            action.payload.forEach(review => {
                newState[review.id] = review;
                // newState[review.spotId] = { ...review.spotId, [review.id]: review }; --not working
            })
            return newState;
        default:
            return state;
    }
}

export default reviewsReducer;

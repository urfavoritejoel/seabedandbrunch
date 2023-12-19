import { csrfFetch } from "./csrf";
import { createSelector } from 'reselect';

const GET_REVIEWS_BY_ID = 'reviews/getById';
const POST_REVIEW = 'reviews/post'

const getReviewsById = (reviews) => {
    return {
        type: GET_REVIEWS_BY_ID,
        payload: reviews
    }
};

const postReview = (review) => {
    return {
        type: POST_REVIEW,
        payload: review
    }
}

export const getReviewsByIdThunk = (spotId) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`);
    const data = await res.json();
    dispatch(getReviewsById(data.Reviews, spotId));
}

export const postReviewThunk = (review) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${review.spotId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(review)
    });

    if (res.ok) {
        const newReview = await res.json();
        dispatch(postReview(newReview));
        return newReview;
    } else {
        const err = await res.json();
        return err;
    }
};

const selectReviews = (state) => state.reviews;
export const selectReviewsArray = createSelector(selectReviews, (reviews) => Object.values(reviews));
export const selectReviewById = (id) => (state) => state.reviews[id];

const initialState = {};

const reviewsReducer = (state = initialState, action) => {
    let newState = { ...state };
    switch (action.type) {
        case GET_REVIEWS_BY_ID:
            action.payload.forEach(review => {
                newState[review.id] = review;
            })
            return newState;
        case POST_REVIEW:
            newState[action.payload.id] = action.payload;
            return newState
        default:
            return state;
    }
}

export default reviewsReducer;

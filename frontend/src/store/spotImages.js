import { csrfFetch } from "./csrf";
import { createSelector } from 'reselect';

const POST_IMAGE = 'spots/addImage'

const postImage = (image) => {
    return {
        type: POST_IMAGE,
        payload: image
    }
}

export const postImageThunk = (image) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${image.spotId}/images`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(image)
    });

    if (res.ok) {
        const newImage = await res.json();
        dispatch(postImage(newImage));
        return newImage;
    }
};

const selectSpotImages = (state) => state.spotImages;
export const selectSpotImagesArray = createSelector(selectSpotImages, (spotImages) => Object.values(spotImages));
export const selectSpotImageById = (id) => (state) => state.spotImages[id];

const initialState = {};

const spotImagesReducer = (state = initialState, action) => {
    let newState = { ...state };
    switch (action.type) {
        case POST_IMAGE:
            newState[action.payload.id] = action.payload;
            return newState
        default:
            return state;
    }
};

export default spotImagesReducer;

import { csrfFetch } from "./csrf";
import { createSelector } from 'reselect';

const GET_ALL_SPOTS = 'spots/getAll';

const getSpots = (spots) => {
    return {
        type: GET_ALL_SPOTS,
        payload: spots
    }
}

export const getSpotsThunk = () => async (dispatch) => {
    const res = await csrfFetch('/api/spots');
    const data = await res.json();
    dispatch(getSpots(data))
}

const selectSpots = (state) => state.spots;
export const selectSpotsArray = createSelector(selectSpots, (spots) => Object.values(spots));

const initialState = {};

const spotsReducer = (state = initialState, action) => {
    let newState = { ...state };
    switch (action.type) {
        case GET_ALL_SPOTS:
            newState = { ...action.payload };
            return newState;
        default:
            return state;
    }
}

export default spotsReducer;

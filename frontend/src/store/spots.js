import { csrfFetch } from "./csrf";
import { createSelector } from 'reselect';

const GET_ALL_SPOTS = 'spots/getAll';
const GET_SPOT = 'spots/getOne';
const POST_SPOT = 'spots/post'

const getSpots = (spots) => {
    return {
        type: GET_ALL_SPOTS,
        payload: spots
    }
}

const getSpot = (spot) => {
    return {
        type: GET_SPOT,
        payload: spot
    }
}

const postSpot = (spot) => {
    return {
        type: POST_SPOT,
        payload: spot
    }
}

export const getSpotsThunk = () => async (dispatch) => {
    const res = await csrfFetch('/api/spots');
    const data = await res.json();
    dispatch(getSpots(data.Spots))
}

export const getSpotThunk = (spotId) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}`);
    const data = await res.json();
    dispatch(getSpot(data));
}

export const postSpotThunk = (spot) => async (dispatch) => {
    const res = await csrfFetch('/api/spots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(spot)
    });

    if (res.ok) {
        const newSpot = await res.json();
        dispatch(postSpot(newSpot));
        return newSpot;
    } else {
        const err = await res.json();
        return err;
    }
}

const selectSpots = (state) => state.spots;
export const selectSpotsArray = createSelector(selectSpots, (spots) => Object.values(spots));
export const selectSpotById = (id) => (state) => state.spots[id];

const initialState = {};

const spotsReducer = (state = initialState, action) => {
    let newState = { ...state };
    switch (action.type) {
        case GET_ALL_SPOTS:
            action.payload.forEach(spot => {
                newState[spot.id] = spot;
            })
            return newState;
        case GET_SPOT:
            newState[action.payload.id] = action.payload;
            return newState;
        case POST_SPOT:
            newState[action.payload.id] = action.payload;
            return newState
        default:
            return state;
    }
}

export default spotsReducer;

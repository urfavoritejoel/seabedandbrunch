import { csrfFetch } from "./csrf";
import { createSelector } from 'reselect';

const GET_ALL_SPOTS = 'spots/getAll';
const GET_SPOT = 'spots/getOne';

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
        default:
            return state;
    }
}

export default spotsReducer;

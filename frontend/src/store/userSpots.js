import { csrfFetch } from "./csrf";
import { createSelector } from 'reselect';

const GET_USER_SPOTS = '/spots/getUserSpots';
const DELETE_USER_SPOT = 'spots/delete';

const getUserSpots = (spots) => {
    return {
        type: GET_USER_SPOTS,
        payload: spots
    }
};

const deleteUserSpot = (spot) => {
    return {
        type: DELETE_USER_SPOT,
        payload: spot
    }
};

export const getUserSpotsThunk = () => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/current`);
    const data = await res.json();
    dispatch(getUserSpots(data.Spots));
    return data.Spots;
};

export const deleteUserSpotThunk = (spot) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spot.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
    });

    if (res.ok) {
        dispatch(deleteUserSpot(spot));
        return;
    } else {
        const err = await res.json();
        return err;
    }
};

const selectUserSpots = (state) => state.userSpots;
export const selectUserSpotsArray = createSelector(selectUserSpots, (spots) => Object.values(spots));
export const selectUserSpotById = (id) => (state) => state.userSpot[id];

const initialState = {};

const userSpotsReducer = (state = initialState, action) => {
    let newState = {};
    switch (action.type) {
        case GET_USER_SPOTS:
            action.payload.forEach(spot => {
                newState[spot.id] = spot;
            })
            return newState;
        case DELETE_USER_SPOT:
            delete newState[action.payload.id]
            return newState;
        default:
            return state;
    }
};

export default userSpotsReducer;

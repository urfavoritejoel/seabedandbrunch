import { useDispatch, useSelector } from "react-redux"
import { getSpotsThunk } from "../../store/spots"
import { selectSpotsArray } from "../../store/spots";
import { useEffect } from "react";
import SingleSpotView from "./SingleSpotView";
import './SpotsView.css';
import { NavLink } from "react-router-dom";

const SpotsView = () => {
    const dispatch = useDispatch();
    const spots = useSelector(selectSpotsArray);

    useEffect(() => {
        dispatch(getSpotsThunk());
    }, [dispatch]);

    if (!spots) return <h1>Loading...</h1>

    return (
        <div>
            <h1>Spots</h1>
            <div className="spotsContainer">
                {spots.map((spot) => (
                    <div key={spot.id}>
                        <NavLink to={`${spot.id}`}>
                            <SingleSpotView spot={spot} />
                        </NavLink>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SpotsView;

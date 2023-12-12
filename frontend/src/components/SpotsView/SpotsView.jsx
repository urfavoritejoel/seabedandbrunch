import { useDispatch, useSelector } from "react-redux"
import { getSpotsThunk } from "../../store/spots"
import { selectSpotsArray } from "../../store/spots";
import { useEffect } from "react";
import SingleSpotView from "./singleSpotView";

const SpotsView = () => {
    const dispatch = useDispatch();
    const spots = useSelector(selectSpotsArray);

    useEffect(() => {
        dispatch(getSpotsThunk());
    }, [dispatch]);

    if (!spots[0]) return <h1>Loading...</h1>

    return (
        <div>
            <h1>Spots</h1>
            <ol>
                {spots[0].map((spot) => (
                    <li key={spot.id}><SingleSpotView spot={spot} /></li>
                ))}
            </ol>
        </div>
    );
}

export default SpotsView;

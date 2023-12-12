import { useDispatch, useSelector } from "react-redux"
import { getSpotsThunk } from "../../store/spots"
import { selectSpotsArray } from "../../store/spots";
import { useEffect } from "react";

const SpotsView = () => {
    const dispatch = useDispatch();
    const spots = useSelector(selectSpotsArray);
    console.log(spots);

    useEffect(() => {
        dispatch(getSpotsThunk());
    }, [dispatch]);

    return (
        <div>
            <h1>Spots</h1>
            <ol>
                {spots[0].map((spot) => (
                    <li key={spot.id}>{spot.address}</li>
                ))}
            </ol>
        </div>
    );
}

export default SpotsView;

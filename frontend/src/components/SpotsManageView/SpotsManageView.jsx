import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react";
import '../SpotsView/SpotsView.css';
import { NavLink } from "react-router-dom";
import { getSpotsThunk } from "../../store/spots";
import { selectSpotsArray } from "../../store/spots";
import SingleSpotView from "../SpotsView/SingleSpotView";
import OpenModalButton from '../OpenModalButton/OpenModalButton';
import DeleteSpotModal from '../DeleteSpotModal/DeleteSpotModal';

const SpotsManageView = () => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.session.user);
    const spotsArr = useSelector(selectSpotsArray);
    const spots = spotsArr.filter(spot => spot.ownerId === user.id)

    useEffect(() => {
        dispatch(getSpotsThunk());
    }, [dispatch]);

    if (!spots) return <h1>Loading...</h1>

    return (
        <div>
            <h1>Manage Spots</h1>
            {spots.length <= 0 &&
                <NavLink to={'/new'}>
                    <button>Create a New Spot</button>
                </NavLink>
            }
            {spots.length > 0 &&
                <div className="spotsContainer">
                    {spots.map((spot) => (
                        <div key={spot.id} className="outerBox">
                            <div className="spotBox">
                                <NavLink to={`../${spot.id}`}>
                                    <SingleSpotView spot={spot} />
                                </NavLink>
                            </div>
                            <NavLink to={`/manage/${spot.id}`}>
                                <button>Update</button>
                            </NavLink>
                            <OpenModalButton
                                buttonText="Delete"
                                modalComponent={<DeleteSpotModal spot={spot} />}
                            />
                        </div>
                    ))}
                </div>
            }
        </div>
    );
}

export default SpotsManageView;

import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react";
import '../SpotsView/SpotsView.css';
import { NavLink } from "react-router-dom";
import { getUserSpotsThunk } from "../../store/userSpots";
import { selectUserSpotsArray } from "../../store/userSpots";
import SingleSpotManage from "./SingleSpotManage";
import OpenModalButton from '../OpenModalButton/OpenModalButton';
import DeleteSpotModal from '../DeleteSpotModal/DeleteSpotModal';

const SpotsManageView = () => {
    const dispatch = useDispatch();
    const spots = useSelector(selectUserSpotsArray);

    useEffect(() => {
        dispatch(getUserSpotsThunk());
    }, [dispatch]);

    if (!spots) return <h1>Loading...</h1>

    return (
        <div>
            <h1>Manage Spots</h1>
            {spots.length <= 0 &&
                <NavLink to={'/new'}>
                    Create a New Spot
                </NavLink>
            }
            {spots.length > 0 &&
                <div className="spotsContainer">
                    {spots.map((spot) => (
                        <div key={spot.id}>
                            <NavLink to={`../${spot.id}`}>
                                <SingleSpotManage spot={spot} />
                            </NavLink>
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

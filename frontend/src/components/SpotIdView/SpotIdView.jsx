import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { selectSpotById } from "../../store/spots";
import { getSpotThunk } from "../../store/spots";
import { useEffect } from "react";
import './SpotIdView.css'

const SpotIdView = () => {
    const dispatch = useDispatch();
    const { id } = useParams();
    const spot = useSelector(selectSpotById(id));
    console.log(spot);

    useEffect(() => {
        dispatch(getSpotThunk(id));
    }, [dispatch, id]);

    if (!spot || !spot.SpotImages) return <h1>Loading...</h1>

    const previewImage = spot.SpotImages.find(image => image.preview === true);
    const nonPreviewImages = spot.SpotImages.filter(image => image.preview === false);

    return (
        <div>
            <div>
                <h1>
                    {spot.name}
                </h1>
            </div>
            <div>Location: {spot.city}, {spot.state}, {spot.country}</div>
            <div className="spotIdImageContainer">
                <div className="biggerImage">
                    <img className="spotIdImg" src={previewImage.url} />
                </div>
                <div className="smallerImages">
                    {nonPreviewImages.map(image => <div key={image.id}><img src={image.url} /></div>)}

                </div>
            </div>
            <div className="host">
                Hosted bya
            </div>
        </div>
    )
}
export default SpotIdView;

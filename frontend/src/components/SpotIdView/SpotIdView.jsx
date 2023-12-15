import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { selectSpotById } from "../../store/spots";
import { selectReviewsArray } from "../../store/reviews";
import { getSpotThunk } from "../../store/spots";
import { getReviewsByIdThunk } from "../../store/reviews";
import { useEffect } from "react";
import './SpotIdView.css'
import ReviewView from "../ReviewView/ReviewView";

const SpotIdView = () => {
    const dispatch = useDispatch();
    const { id } = useParams();
    console.log("***", Number(id));
    const spot = useSelector(selectSpotById(id));
    const reviews = useSelector(selectReviewsArray);
    const filteredReviews = reviews.filter(review => review.spotID === Number(id))
    console.log(filteredReviews);


    useEffect(() => {
        dispatch(getSpotThunk(id));
        dispatch(getReviewsByIdThunk(id));
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
                Hosted by {spot.Owner.firstName} {spot.Owner.lastName}
            </div>
            <div className="descriptionCalloutContainer">
                <p>
                    {spot.description}
                </p>
                <div>
                    <div className="calloutHeader">
                        <div>
                            ${spot.price} / Night
                        </div>
                        <div>
                            <i className='fa-solid fa-star'></i>
                            {spot.avgStarRating === 0 ? "New!" : spot.avgStarRating}
                        </div>
                    </div>
                    <p><button onClick={() => alert("Feature coming soon!")}>Reserve</button></p>
                </div>
            </div>
            <hr></hr>
            <div className="reviewsContainer">
                <div className="reviewsHeader">
                    <i className='fa-solid fa-star'></i>
                    {spot.avgStarRating === 0 ? "New!" : spot.avgStarRating} {reviews.length > 0 && `${<span>&#183;</span>} ${reviews.length} Review${reviews.length === 1 ? '' : 's'}`}
                </div>
                <div>
                    {reviews.map((review) => (
                        <div key={review.id}>
                            <ReviewView review={review} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
export default SpotIdView;

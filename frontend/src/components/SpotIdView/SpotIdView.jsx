import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { selectSpotById } from "../../store/spots";
import { selectReviewsArray } from "../../store/reviews";
import { getSpotThunk } from "../../store/spots";
import { getReviewsByIdThunk } from "../../store/reviews";
import { useEffect } from "react";
import './SpotIdView.css'
import ReviewView from "../ReviewView/ReviewView";
import PostReviewModal from "../PostReviewModal/PostReviewModal";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import DeleteReviewModal from "../../DeleteReviewModal/DeleteReviewModal";

const SpotIdView = () => {
    const dispatch = useDispatch();
    const { id } = useParams();
    const user = useSelector(state => state.session.user);
    const spot = useSelector(selectSpotById(id));
    const reviews = useSelector(selectReviewsArray);
    const filteredReviews = reviews.filter(review => review.spotId === Number(id)).reverse();
    let avgRating = 0;
    filteredReviews.forEach(review => avgRating += review.stars)
    avgRating = avgRating / filteredReviews.length;

    let userReviews;
    if (user) {
        userReviews = filteredReviews.filter(review => review.userId === user.id);
    }

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
            <div className="spotIdImageContainer grid">
                <div className="biggerImage box">
                    <img className="spotIdImg" src={previewImage.url} />
                </div>


                {nonPreviewImages.length > 0 ?
                    <div className="smallImage box">
                        <img src={nonPreviewImages[0]?.url} key={nonPreviewImages[0]?.id} />
                    </div>
                    : ''}
                {nonPreviewImages.length > 1 ?
                    <div className="smallImage2 box">
                        <img src={nonPreviewImages[1]?.url} key={nonPreviewImages[1]?.id} />
                    </div>
                    : ''}
                {nonPreviewImages.length > 2 ?
                    <div className="smallImage3 box">
                        <img src={nonPreviewImages[2]?.url} key={nonPreviewImages[2]?.id} />
                    </div>
                    : ''}
                {nonPreviewImages.length > 3 ?
                    <div className="smallImage4 box">
                        <img src={nonPreviewImages[3]?.url} key={nonPreviewImages[3]?.id} />

                    </div>
                    : ''}

            </div>
            <div className="host">
                Hosted by {spot.Owner.firstName} {spot.Owner.lastName}
            </div>
            <div className="descriptionCalloutContainer">
                <p>
                    {spot.description}
                </p>
                <div className="ratingsReserve">
                    <div className="calloutHeader">
                        <div>
                            ${spot.price} / Night
                        </div>
                        <div>
                            <i className='fa-solid fa-star'></i>
                            {avgRating === 0 || isNaN(avgRating) ? "New!" : avgRating.toFixed(2)}
                            {filteredReviews.length > 0 && <span>&#183;</span>}
                            {filteredReviews.length > 0 && ` ${filteredReviews.length} Review${filteredReviews.length > 1 ? 's' : ''}`}
                        </div>
                    </div>
                    {user ?
                        <p>
                            <button onClick={() => alert("Feature coming soon!")}>Reserve</button>
                        </p>
                        : ''
                    }
                </div>
            </div>
            <hr></hr>
            <div className="reviewsContainer">
                <div className="reviewsHeader">
                    <i className='fa-solid fa-star'></i>
                    {avgRating === 0 || isNaN(avgRating) ? "New!" : avgRating.toFixed(2)}
                    {filteredReviews.length > 0 && <span>&#183;</span>}
                    {filteredReviews.length > 0 && `${filteredReviews.length} Review${filteredReviews.length > 1 ? 's' : ''}`}
                </div>
                {user ? user.id !== spot.ownerId && !userReviews?.length &&
                    <OpenModalButton
                        buttonText="Post Your Review"
                        modalComponent={<PostReviewModal user={user} spot={spot} />}
                    />
                    : ''
                }
                <div>
                    {filteredReviews.length > 0 && filteredReviews.map((review) => (
                        <div key={review.id}>
                            <ReviewView review={review} />
                            {user ? review.userId === user.id &&
                                <OpenModalButton
                                    buttonText="Delete"
                                    modalComponent={<DeleteReviewModal review={review} />}
                                />
                                : ''
                            }
                        </div>
                    ))}
                    {user ?
                        filteredReviews.length <= 0 && user.id !== spot.ownerId && <p>Be the first to post a review!</p>
                        : ''}
                </div>
            </div>
        </div>
    )
}
export default SpotIdView;

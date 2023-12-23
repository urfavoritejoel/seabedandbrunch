import './SpotsView.css';

const SingleSpotView = (spot) => {
    spot = spot.spot;

    return (
        <>
            <div className='singleSpotImageContainer'>
                <img className='singleSpotImg' src={spot.previewImage} alt={spot.name} title={spot.name} />
            </div>
            <div className="spotDetails">
                <h4> {spot.city}, {spot.state}</h4>
                <div>
                    <i className='fa-solid fa-star'></i>
                    {spot.avgStarRating > 0 ? spot.avgStarRating.toFixed(2) : "New!"}</div>
            </div>
            <div className='spotDetails'>${spot.price} / night</div>
        </ >
    )
}

export default SingleSpotView;

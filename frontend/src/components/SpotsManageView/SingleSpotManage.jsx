
const SingleSpotManage = (spot) => {
    spot = spot.spot;

    return (
        <div className="spot">
            <div className='singleSpotImageContainer'>
                <img className='singleSpotImg' src={spot.previewImage} alt={spot.name} title={spot.name} />
            </div>
            <div className="spotDetails">
                <h4> {spot.city}, {spot.state}</h4>
                <div>
                    <i className='fa-solid fa-star'></i>
                    {spot.avgRating === 0 ? "New!" : spot.avgRating}</div>
            </div>
            <div>${spot.price} / night</div>
        </div >
    )
}

export default SingleSpotManage;

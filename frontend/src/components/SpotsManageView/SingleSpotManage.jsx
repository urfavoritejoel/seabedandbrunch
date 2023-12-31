
const SingleSpotManage = (spot) => {
    // console.log("first: ***\n\n", spot);
    spot = spot.spot;
    // console.log("second: ***\n\n", spot);

    return (
        <div className="spot">
            <div className='singleSpotImageContainer'>
                <img className='singleSpotImg' src={spot.previewImage} alt={spot.name} title={spot.name} />
            </div>
            <div className="spotDetails">
                <h4> {spot.city}, {spot.state}</h4>
                <div>
                    <i className='fa-solid fa-star'></i>
                    {spot.avgStarRating === 0 ? "New!" : spot.avgStarRating.toFixed(2)}</div>
            </div>
            <div>${spot.price} / night</div>
        </div >
    )
}

export default SingleSpotManage;

// import { useDispatch } from "react-redux"


const SingleSpotView = (spot) => {
    // const dispatch = useDispatch();
    console.log(spot.spot);
    return (
        <div>
            <img src={spot.spot.previewImage} />
        </div>
    )
}

export default SingleSpotView;

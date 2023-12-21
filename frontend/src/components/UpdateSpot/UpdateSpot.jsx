import { useState } from "react";
import { putSpotThunk } from "../../store/spots";
// import { postImageThunk } from "../../store/spotImages";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
// import './CreateSpot.css'

const UpdateSpot = () => {
    const { id } = useParams();
    const spot = useSelector(state => state.spots[id]);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    // const user = useSelector(state => state.session.user);
    const [country, setCountry] = useState(spot.country);
    const [address, setAddress] = useState(spot.address);
    const [city, setCity] = useState(spot.city);
    const [state, setState] = useState(spot.state);
    const [latitude] = useState(spot.lat);
    const [longitude] = useState(spot.lng);
    const [description, setDescription] = useState(spot.description);
    const [name, setName] = useState(spot.name);
    const [price, setPrice] = useState(spot.price);
    const [validationErrors, setValidationErrors] = useState({});
    const [hasSubmitted, setHasSubmitted] = useState(false);

    const handleSubmit = async e => {
        // Prevent the default form behavior so the page doesn't reload.
        e.preventDefault();
        setHasSubmitted(true);

        const newSpot = {
            id: spot.id,
            country,
            address,
            city,
            state,
            description,
            name,
            'price': Number(price),
            'lat': latitude,
            'lng': longitude
        }

        if (!validationErrors.length) {
            const spot = await dispatch(putSpotThunk(newSpot))
                .catch(async (res) => {
                    const err = await res.json();

                    if (err && err.errors) {
                        setValidationErrors(err.errors);
                        console.log(err.errors);
                    }
                });
            navigate(`/${spot.id}`)
        }
    }

    return (
        <div className="pageContainer">
            <div className="Header">
                <h1>Update your Spot</h1>
            </div>
            <div>
                <form onSubmit={handleSubmit}>
                    <div className="formContainer">
                        <div className="header">
                            <h2>Where&apos;s your place located?</h2>
                            <h3>Guests will only get your exact address once they booked a reservation.</h3>
                        </div>
                        <div className="singleBox">
                            <label>Country
                                <input
                                    type="text"
                                    placeholder="Country"
                                    value={country}
                                    onChange={(e) => setCountry(e.target.value)}
                                />
                            </label>
                            {validationErrors.country && hasSubmitted &&
                                <p className="error">{validationErrors.country}</p>}
                        </div>
                        <div className="singleBox">
                            <label>Street Address
                                <input
                                    type="text"
                                    placeholder="Address"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                />
                            </label>
                            {validationErrors.address && hasSubmitted &&
                                <p className="error">{validationErrors.address}</p>}
                        </div>
                        <div className="inlineBoxes">
                            <label>City
                                <input
                                    type="text"
                                    placeholder="City"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                />
                            </label>
                            {validationErrors.city && hasSubmitted &&
                                <p className="error">{validationErrors.city}</p>}
                            <label>State
                                <input
                                    type="text"
                                    placeholder="State"
                                    value={state}
                                    onChange={(e) => setState(e.target.value)}
                                />
                            </label>
                            {validationErrors.state && hasSubmitted &&
                                <p className="error">{validationErrors.state}</p>}
                        </div>
                        <hr />
                        {/* <div className="inlineBoxes">
                            <label>Latitude
                                <input
                                    type="text"
                                    placeholder="Latitude"
                                    value={latitude}
                                    onChange={(e) => setLatitude(e.target.value)}
                                />
                            </label>
                            <label>Longitude
                                <input
                                    type="text"
                                    placeholder="Longitude"
                                    value={longitude}
                                    onChange={(e) => setLongitude(e.target.value)}
                                />
                            </label>
                        </div> */}
                    </div>
                    <div className="header">
                        <h2>Describe your place to guests</h2>
                        <h3>Mention the best features of your space, any special amenities like fast wifi
                            or parking, and what you love about the neighborhood.
                        </h3>
                    </div>
                    <div className="singleBox">
                        <textarea
                            placeholder="Please write at least 30 characters"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        ></textarea>
                        {validationErrors.description && hasSubmitted &&
                            <p className="error">{validationErrors.description}</p>}
                    </div>
                    <hr />
                    <div className="header">
                        <h2>Create a title for your spot</h2>
                        <h3>Catch guests&apos; attention with a spot title that highlights what makes
                            your place special.
                        </h3>
                    </div>
                    <div className="singleBox">
                        <input
                            type="text"
                            placeholder="Name of your spot"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        {validationErrors.name && hasSubmitted &&
                            <p className="error">{validationErrors.name}</p>}
                    </div>
                    <hr />
                    <div className="header">
                        <h2>Set a base price for your spot</h2>
                        <h3>Competitive pricing can help your listing stand out and rank higher in search results.
                        </h3>
                    </div>
                    <div className="singleBox">
                        $ <input
                            type="text"
                            placeholder="Price per night (USD)"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />
                        {validationErrors.price && hasSubmitted &&
                            <p className="error">{validationErrors.price}</p>}
                    </div>
                    <hr />
                    <button type="submit">Update your Spot</button>
                </form>
            </div>
        </div>
    )
};

export default UpdateSpot;

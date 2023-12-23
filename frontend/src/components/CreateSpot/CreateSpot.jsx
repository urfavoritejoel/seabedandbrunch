import { useState } from "react";
import { postSpotThunk } from "../../store/spots";
import { postImageThunk } from "../../store/spotImages";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import './CreateSpot.css'

const CreateSpot = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector(state => state.session.user);
    const [country, setCountry] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [latitude] = useState(1);
    const [longitude] = useState(1);
    const [description, setDescription] = useState('');
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [preview, setPreview] = useState('');
    const [image2, setImage2] = useState('');
    const [image3, setImage3] = useState('');
    const [image4, setImage4] = useState('');
    const [image5, setImage5] = useState('');
    const [validationErrors, setValidationErrors] = useState({});
    const [hasSubmitted, setHasSubmitted] = useState(false);

    // useEffect(() => {
    //     let errors = {};

    //     if (!country.length) errors['country'] = "Country is required";
    //     if (!address.length) errors['address'] = "Address is required";
    //     if (!city.length) errors['city'] = "City is required";
    //     if (!state.length) errors['state'] = "State is required";
    //     if (!description.length) errors['description'] = "Description is required";
    //     if (description.length > 0 && description.length < 30) errors['description'] = "Description needs 30 or more characters";
    //     if (!name.length) errors['name'] = "Title is required";
    //     if (!price.length) errors['price'] = "Price is required";
    //     if (!preview.length) errors['preview'] = "Preview image is required";

    //     setValidationErrors(errors);
    // }, [country, address, city, state, description, name, price, preview, image2, image3, image4, image5]);

    const handleSubmit = async e => {
        // Prevent the default form behavior so the page doesn't reload.
        e.preventDefault();
        setHasSubmitted(true);

        const images = [
            {
                'url': preview,
                'preview': true,
            },
        ];

        if (image2) images.push({ 'url': image2, preview: false });
        if (image3) images.push({ 'url': image3, preview: false });
        if (image4) images.push({ 'url': image4, preview: false });
        if (image5) images.push({ 'url': image5, preview: false });

        const newSpot = {
            country,
            'ownerId': user.id,
            address,
            city,
            state,
            description,
            name,
            'price': Number(price),
            'lat': latitude,
            'lng': longitude,
        }

        if (!validationErrors.length) {
            const spot = await dispatch(postSpotThunk(newSpot))
                .catch(async (res) => {
                    const err = await res.json();

                    if (err && err.errors) {
                        setValidationErrors(err.errors);
                    }
                });
            console.log(spot);
            dispatch(postImageThunk({
                'url': preview,
                'preview': true,
                'spotId': spot.id
            }))
            if (image2) dispatch(postImageThunk({
                'url': image2,
                'preview': false,
                'spotId': spot.id
            }))
            if (image3) dispatch(postImageThunk({
                'url': image3,
                'preview': false,
                'spotId': spot.id
            }))
            if (image4) dispatch(postImageThunk({
                'url': image4,
                'preview': false,
                'spotId': spot.id
            }))
            if (image5) dispatch(postImageThunk({
                'url': image5,
                'preview': false,
                'spotId': spot.id
            }))
            navigate(`/${spot.id}`)
        }
    }
    return (
        <div className="pageContainer">
            <div className="Header">
                <h1>Create a new Spot</h1>
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
                    <div className="header">
                        <h2>Liven up your spot with photos</h2>
                        <h3>Submit a link to at least one photo to publish your spot.</h3>
                    </div>
                    <div className="singleBox">
                        <input
                            type="text"
                            placeholder="Preview Image URL"
                            value={preview}
                            onChange={(e) => setPreview(e.target.value)}
                        />
                        {preview === '' && hasSubmitted &&
                            <p className="error">Preview Image is Required</p>}
                    </div>
                    <div className="singleBox">
                        <input
                            type="text"
                            placeholder="Image URL"
                            value={image2}
                            onChange={(e) => setImage2(e.target.value)}
                        />
                    </div>
                    <div className="singleBox">
                        <input
                            type="text"
                            placeholder="Image URL"
                            value={image3}
                            onChange={(e) => setImage3(e.target.value)}
                        />
                    </div>
                    <div className="singleBox">
                        <input
                            type="text"
                            placeholder="Image URL"
                            value={image4}
                            onChange={(e) => setImage4(e.target.value)}
                        />
                    </div>
                    <div className="singleBox">
                        <input
                            type="text"
                            placeholder="Image URL"
                            value={image5}
                            onChange={(e) => setImage5(e.target.value)}
                        />
                    </div>
                    <hr />
                    <button type="submit">Create Spot</button>
                </form>
            </div>
        </div>
    )
};

export default CreateSpot;

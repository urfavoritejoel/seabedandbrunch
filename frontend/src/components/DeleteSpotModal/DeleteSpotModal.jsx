import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import { deleteSpotThunk } from '../../store/spots';
import { deleteUserSpotThunk } from '../../store/userSpots';

function DeleteSpotModal({ spot }) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    const handleDelete = (e) => {
        e.preventDefault();
        return dispatch(deleteSpotThunk(spot))
            .then(dispatch(deleteUserSpotThunk(spot)))
            .then(closeModal)
    }

    return (
        <>
            <h1>Confirm Delete</h1>
            <p>Are you sure you want to remove this spot?</p>
            <button onClick={handleDelete} className='deleteButton'>Yes (Delete Spot)</button>
            <button onClick={closeModal} className='cancelDelete'>No (Keep Spot)</button>
        </>
    );
}

export default DeleteSpotModal;

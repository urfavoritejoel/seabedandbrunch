import { useDispatch } from 'react-redux';
import { useModal } from '../context/Modal';
import { deleteReviewThunk } from '../store/reviews';

function DeleteReviewModal({ review }) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    const handleDelete = (e) => {
        e.preventDefault();
        return dispatch(deleteReviewThunk(review))
            .then(closeModal)
    }

    return (
        <>
            <h1>Confirm Delete</h1>
            <p>Are you sure you want to delete this review?</p>
            <button onClick={handleDelete}>Yes (Delete Review)</button>
            <button onClick={closeModal}>No (Keep Review)</button>
        </>
    );
}

export default DeleteReviewModal;

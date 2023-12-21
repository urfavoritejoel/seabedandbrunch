import { useState } from 'react';
import { postReviewThunk } from '../../store/reviews';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';

function PostReviewModal({ user, spot }) {
    const dispatch = useDispatch();
    const [comment, setComment] = useState('');
    const [stars, setStars] = useState('');
    const [errors, setErrors] = useState({});
    const { closeModal } = useModal();

    const handleSubmit = (e) => {
        e.preventDefault();

        const review = {
            review: comment,
            stars: Number(stars),
            userId: user.id,
            spotId: spot.id
        }

        return dispatch(postReviewThunk(review, user))
            .then(closeModal)
            .catch(async (res) => {
                const err = await res.json();

                if (err && err.errors) {
                    setErrors(err.errors);
                }
            });
    };

    return (
        <div className='reviewFormContainer'>
            <h1>How was your stay?</h1>
            {errors.length &&
                <p className='errors'>{errors}</p>}
            <form onSubmit={handleSubmit}>
                <div className='reviewComment'>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder='Leave your review here...'
                    ></textarea>
                </div>
                <div className='reviewStars'>
                    <select
                        value={stars}
                        onChange={(e) => setStars(e.target.value)}
                    >
                        <option value={0}>Please select star rating...</option>
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                        <option value={5}>5</option>
                    </select>
                    Stars
                </div>
                <button type="submit" disabled={comment.length < 10 || stars < 1}>Submit Your Review</button>
            </form>
        </div>
    );
}

export default PostReviewModal;

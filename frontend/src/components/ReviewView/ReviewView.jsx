

const ReviewView = (review) => {
    review = review.review;
    const months = [
        'Janurary',
        'Feburary',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ];

    if (!review) return <h1>Loading...</h1>

    const reviewMonth = months[Number(review.createdAt.slice(5, 7)) - 1];
    const reviewYear = review.createdAt.slice(0, 4);

    return (
        <>
            {review.User.firstName && <h1>{review.User.firstName}</h1>}
            <h3>{reviewMonth} {reviewYear}</h3>
            <p>{review.review}</p>
        </>
    )
}

export default ReviewView;

import Review from '../models/Review.js';

export async function getReviews(_request, response) {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    return response.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews from MongoDB:', error.message);
    return response.status(500).json({
      success: false,
      message: 'Failed to fetch reviews',
      error: error.message
    });
  }
}

export async function createReview(request, response) {
  try {
    const { author, publication, quote, rating, favoriteItem, date } = request.body;

    if (!author || typeof author !== 'string' || author.trim().length < 2) {
      return response.status(400).json({
        success: false,
        message: 'Author name must be at least 2 characters long'
      });
    }

    if (!quote || typeof quote !== 'string' || quote.trim().length < 5) {
      return response.status(400).json({
        success: false,
        message: 'Review quote must be at least 5 characters long'
      });
    }

    const numRating = Number(rating);
    if (!Number.isInteger(numRating) || numRating < 1 || numRating > 5) {
      return response.status(400).json({
        success: false,
        message: 'Rating must be an integer between 1 and 5'
      });
    }

    const sanitizedAuthor = author.trim().slice(0, 60);
    const sanitizedPublication = publication && typeof publication === 'string'
      ? publication.trim().slice(0, 60)
      : 'Verified Patron';
    const sanitizedQuote = quote.trim().slice(0, 600);
    const sanitizedFavorite = favoriteItem && typeof favoriteItem === 'string'
      ? favoriteItem.trim().slice(0, 100)
      : undefined;

    const review = await Review.create({
      author: sanitizedAuthor,
      publication: sanitizedPublication,
      quote: sanitizedQuote,
      rating: numRating,
      favoriteItem: sanitizedFavorite,
      date: date || new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    });

    return response.status(201).json({
      success: true,
      message: 'Review created successfully',
      review,
      data: review
    });
  } catch (error) {
    console.error('Error creating review in MongoDB:', error.message);
    return response.status(500).json({
      success: false,
      message: 'Failed to create review',
      error: error.message
    });
  }
}


import Review from '../models/Review.js';

export async function getReviews(_request, response) {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    return response.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews from MongoDB:', error.message);
    return response.status(500).json({ error: 'Failed to fetch reviews', message: error.message });
  }
}

export async function createReview(request, response) {
  try {
    const { author, publication, quote, rating, favoriteItem, date } = request.body;
    
    if (!author || !quote) {
      return response.status(400).json({ error: 'Author and quote are required' });
    }

    const review = await Review.create({
      author,
      publication: publication || 'Verified Patron',
      quote,
      rating: Number(rating) || 5,
      favoriteItem,
      date: date || new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    });

    return response.status(201).json({ success: true, review });
  } catch (error) {
    console.error('Error creating review in MongoDB:', error.message);
    return response.status(500).json({ error: 'Failed to create review', message: error.message });
  }
}

export default function NutritionInfo({ nutrition }) {
	return <div className="nutrition-pill">{nutrition.calories} · {nutrition.protein} P · {nutrition.carbs} C · {nutrition.fat} F</div>;
}

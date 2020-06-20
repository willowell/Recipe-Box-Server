import { RESTDataSource } from 'apollo-datasource-rest'
import _ from 'lodash'

/**
 * The data from The MealDB is in the form:
 * data: { meals: [ {Meal1}, {Meal2}, {Meal3}, etc. ] }
 *
 * I am using a mealReducer to convert the incoming JSON into the form my GraphQL type expects
 * primarily because the JSON has types attached to the names, e.g., "strMeal", "idMeal".
 * There's no need for these since the GraphQL schema tracks the types of the fields.
 */
export default class MealsAPI extends RESTDataSource {
  constructor () {
    super()
    this.baseURL = `https://www.themealdb.com/api/json/v1/${process.env.API_KEY}`
  }

  // Converts the JSON data from The MealDB into the form the GraphQL schema expects
  mealReducer (incoming: any) {
    const nullifyEmpty = (str: string | string[]) => _.isEmpty(str) ? null : str

    return {
      id: parseInt(incoming.idMeal),
      name: incoming.strMeal,
      drinkAlternate: incoming.strDrinkAlternate,
      category: incoming.strCategory,
      area: incoming.strArea,
      // Remove empty strings. Some of the instructions have line breaks built into the string,
      // but I have chosen to remove them so the user of this server may format the instructions however they like.
      instructions: _.filter(_.split(incoming.strInstructions, '\r\n'), (line) => !_.isEmpty(line)),
      thumbnail: incoming.strMealThumb,
      tags: nullifyEmpty(_.split(incoming.strTags, ',')),
      youtube: incoming.strYoutube,
      // Pair ingredients and their amounts from the API into objects,
      // and remove any empty strings from the resulting array.
      // Many of the meals do not use all 20 ingredients, so there's no reason
      // why the resulting GraphQL query should have more ingredients than are actually in use.
      ingredients: _.filter([
        { name: nullifyEmpty(incoming.strIngredient1), amount: nullifyEmpty(incoming.strMeasure1) },
        { name: nullifyEmpty(incoming.strIngredient2), amount: nullifyEmpty(incoming.strMeasure2) },
        { name: nullifyEmpty(incoming.strIngredient3), amount: nullifyEmpty(incoming.strMeasure3) },
        { name: nullifyEmpty(incoming.strIngredient4), amount: nullifyEmpty(incoming.strMeasure4) },
        { name: nullifyEmpty(incoming.strIngredient5), amount: nullifyEmpty(incoming.strMeasure5) },
        { name: nullifyEmpty(incoming.strIngredient6), amount: nullifyEmpty(incoming.strMeasure6) },
        { name: nullifyEmpty(incoming.strIngredient7), amount: nullifyEmpty(incoming.strMeasure7) },
        { name: nullifyEmpty(incoming.strIngredient8), amount: nullifyEmpty(incoming.strMeasure8) },
        { name: nullifyEmpty(incoming.strIngredient9), amount: nullifyEmpty(incoming.strMeasure9) },
        { name: nullifyEmpty(incoming.strIngredient10), amount: nullifyEmpty(incoming.strMeasure10) },
        { name: nullifyEmpty(incoming.strIngredient11), amount: nullifyEmpty(incoming.strMeasure11) },
        { name: nullifyEmpty(incoming.strIngredient12), amount: nullifyEmpty(incoming.strMeasure12) },
        { name: nullifyEmpty(incoming.strIngredient13), amount: nullifyEmpty(incoming.strMeasure13) },
        { name: nullifyEmpty(incoming.strIngredient14), amount: nullifyEmpty(incoming.strMeasure14) },
        { name: nullifyEmpty(incoming.strIngredient15), amount: nullifyEmpty(incoming.strMeasure15) },
        { name: nullifyEmpty(incoming.strIngredient16), amount: nullifyEmpty(incoming.strMeasure16) },
        { name: nullifyEmpty(incoming.strIngredient17), amount: nullifyEmpty(incoming.strMeasure17) },
        { name: nullifyEmpty(incoming.strIngredient18), amount: nullifyEmpty(incoming.strMeasure18) },
        { name: nullifyEmpty(incoming.strIngredient19), amount: nullifyEmpty(incoming.strMeasure19) },
        { name: nullifyEmpty(incoming.strIngredient20), amount: nullifyEmpty(incoming.strMeasure20) }
      ], ({ name }) => !_.isEmpty(name)),
      source: incoming.strSource,
      dateModified: incoming.dateModified
    }
  }

  categoryReducer (incoming: any) {
    return {
      id: parseInt(incoming.idCategory),
      name: incoming.strCategory,
      thumbnail: incoming.strCategoryThumb,
      description: incoming.strCategoryDescription
    }
  }

  ingredientReducer (incoming: any) {
    return {
      id: parseInt(incoming.idIngredient),
      name: incoming.strIngredient,
      description: incoming.strDescription,
      kind: incoming.strType
    }
  }

  normalize (data: any, reducer: any) {
    return _.isArray(data) ? _.map(data, (datum: any) => reducer(datum)) : []
  }

  // Search for a meal by name
  async getMealByName (name: string) {
    const { meals } = await this.get(`/search.php?s=${name}`)
    return _.head(this.normalize(meals, this.mealReducer))
  }

  // List all meals by first letter
  async getMealsByFirstLetter (letter: string) {
    const { meals } = await this.get(`/search.php?f=${letter}`)
    return this.normalize(meals, this.mealReducer)
  }

  // Search for a meal by ID
  async getMealByID (id: number) {
    const { meals } = await this.get(`/lookup.php?i=${id}`)
    return _.head(this.normalize(meals, this.mealReducer))
  }

  // Get a single random meal
  async getRandomMeal () {
    const { meals } = await this.get('/random.php')
    return _.head(this.normalize(meals, this.mealReducer))
  }

  // Get a selection of 10 random meals
  //! LOCKED TO PATREON SUPPORTERS
  async getRandomMealSelection () {
    const { meals } = await this.get('/randomselection.php')
    return this.normalize(meals, this.mealReducer)
  }

  // Get a list of all meal categories
  async getAllCategories () {
    const { meals } = await this.get('/categories.php')
    return this.normalize(meals, this.categoryReducer)
  }

  // Get a list of all meal ingredients
  async getAllIngredients () {
    const { meals } = await this.get('/list.php?i=list')
    return this.normalize(meals, this.ingredientReducer)
  }

  // Get the latest meals
  //! LOCKED TO PATREON SUPPORTERS
  async getLatestMeals () {
    const { meals } = await this.get('/latest.php')
    return this.normalize(meals, this.mealReducer)
  }

  // Search for some meals by main ingredient
  async getMealsByMainIngredient (mainIngredient: string) {
    const { meals } = await this.get(`/filter.php?i=${mainIngredient}`)
    return this.normalize(meals, this.mealReducer)
  }

  // Search for meals by a list of ingredients
  //! LOCKED TO PATREON SUPPORTERS
  async getMealsByIngredients (ingredients: string[]) {
    const { meals } = await this.get(`/filter.php?i=${_.join(ingredients, ',')}`)
    return this.normalize(meals, this.mealReducer)
  }

  // Search for some meals by category
  async getMealsByCategory (category: string) {
    const { meals } = await this.get(`/filter.php?c=${category}`)
    return this.normalize(meals, this.mealReducer)
  }

  // Search for some meals by area (Italian, Japanese, etc.)
  async getMealsByArea (area: string) {
    const { meals } = await this.get(`/filter.php?a=${area}`)
    return this.normalize(meals, this.mealReducer)
  }
}

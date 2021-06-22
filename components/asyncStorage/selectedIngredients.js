import AsyncStorage from "@react-native-async-storage/async-storage";

export async function getSelectedIngredients(catId, selectedIngredientsRetrieved) {
  try {
    var savedIngredientsStr = await AsyncStorage.getItem("@selected_ing_" + catId);
  } catch (e) {
    console.log("Error getting selected ingredients.");
  }

  var selectedIngArr = [];

  if(savedIngredientsStr) {
    selectedIngArr = JSON.parse(savedIngredientsStr);
  }
   
  selectedIngredientsRetrieved(selectedIngArr); //parse back to array
}

export async function saveSelectedIngredients(catId, selectedIngArr) {
  try {
    await AsyncStorage.setItem("@selected_ing_" + catId, JSON.stringify(selectedIngArr)); //save to string when saving
  } catch (e) {
    console.log("Error saving selected ingredients.");
  }
}

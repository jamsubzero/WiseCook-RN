import AsyncStorage from "@react-native-async-storage/async-storage";

export async function getSelectedIngredients(selectedIngredientsRetrieved) {
  try {
    var savedIngredientsStr = await AsyncStorage.getItem("@selected_ing");
  } catch (e) {
    console.log("Error getting selected ingredients.");
  }

  var selectedIngArr = [];

  if(savedIngredientsStr) {
    selectedIngArr = JSON.parse(savedIngredientsStr);
  }
   
  selectedIngredientsRetrieved(selectedIngArr); //parse back to array
}

export async function saveSelectedIngredients(selectedIngArr) {
  try {
    AsyncStorage.setItem("@selected_ing", JSON.stringify(selectedIngArr)); //save to string when saving
  } catch (e) {
    console.log("Error saving selected ingredients.");
  }
}

import AsyncStorage from '@react-native-async-storage/async-storage';

export async function getSelectedIngredients(
  catId
) {
  try {
    var savedIngredientsStr = await AsyncStorage.getItem(
      '@selected_ing_' + catId,
    );
  } catch (e) {
    console.log('Error getting selected ingredients.');
  }

  var selectedIngArr = [];

  if (savedIngredientsStr) {
    selectedIngArr = JSON.parse(savedIngredientsStr);
  }

  return selectedIngArr;
}

export async function saveSelectedIngredients(catId, selectedIngArr) {
  try {
    await AsyncStorage.setItem(
      '@selected_ing_' + catId,
      JSON.stringify(selectedIngArr),
    ); //save to string when saving
  } catch (e) {
    console.log('Error saving selected ingredients.');
  }
}

export async function getAllSelectedIngredients() {
  var allSelectedIngArr = [];
  try {
    const keys = await AsyncStorage.getAllKeys();

    for (const key of keys) {
      if (!key.includes('@selected_ing_')) {
        console.log('skipped');
        continue;
      }

      var items = await AsyncStorage.getItem(key);
      if (items) {
        var selectedIngs = [];
        try {
          selectedIngs = JSON.parse(items);
        } catch (e) {
          console.log('JSON parsing error: ' + e);
        }
        for (const selected of selectedIngs) {
          allSelectedIngArr.push(selected);
        }
      }
    }
  } catch (e) {
    console.log(e);
  }

  console.log("All selected Ings: " + allSelectedIngArr);

  return allSelectedIngArr;
}

export async function getMultipleSelectedIngs(catIdArr) {
  var allSelectedIngArr = [];
  try {
    var savedIngredients = await AsyncStorage.multiGet(catIdArr);
    for (const ingCat of savedIngredients) {
      for (let i = 1; i < ingCat.length; i++) {
        var items = ingCat[i];
        if (items) {
          var selectedIngs = [];
          try {
            selectedIngs = JSON.parse(items);
          } catch (e) {
            console.log('JSON parsing error: ' + e);
          }
          for (const selected of selectedIngs) {
            allSelectedIngArr.push(selected);
          }
        }
      }
    }
  } catch (e) {
    console.log('Error getting selected ingredients.');
  }

 return allSelectedIngArr; //parse back to array
}

export async function getShoppingList() {
  try {
    var savedShoppingStr = await AsyncStorage.getItem('@shopping_list');
  } catch (e) {
    console.log('Error getting shopping list.');
  }

  var selectedIngArr = [];

  if (savedShoppingStr) {
    selectedIngArr = JSON.parse(savedShoppingStr);
  }

  return selectedIngArr;
}

export async function saveShoppingList(selectedIngArr) {
  try {
    await AsyncStorage.setItem('@shopping_list',
      JSON.stringify(selectedIngArr),
    );
  } catch (e) {
    console.log('Error saving shopping list.');
  }
}

export async function getHeartedRecipes() {
  try {
    var savedHeartedRecipesStr = await AsyncStorage.getItem('@hearted_recipes');
  } catch (e) {
    console.log('Error getting recipe list.');
  }

  var heartedRecipesArr = [];

  if (savedHeartedRecipesStr) {
    heartedRecipesArr = JSON.parse(savedHeartedRecipesStr);
  }

  return heartedRecipesArr;
}

export async function saveHeartedRecipes(heartedRecipesArr) {
  try {
    await AsyncStorage.setItem('@hearted_recipes',
      JSON.stringify(heartedRecipesArr),
    );
  } catch (e) {
    console.log('Error saving hearted recipes.');
  }
}

export async function getInterstitialCount() {
  let count = 1;
  try {
    var intersCountStr = await AsyncStorage.getItem('@inters_count');
    console.log("intersCountStr");
    console.log(intersCountStr);
    count = parseInt(intersCountStr);
  } catch (e) {
    console.log('Error getting intersCount:', e);
    count = 1;
  }

  return count;
}

export async function saveInterstitialCount(inters_count) {
  try {
    await AsyncStorage.setItem('@inters_count', inters_count.toString());
  } catch (e) {
    console.log('Error saving inters count.');
  }
}

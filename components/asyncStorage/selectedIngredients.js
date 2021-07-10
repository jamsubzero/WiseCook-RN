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

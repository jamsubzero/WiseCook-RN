import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
  TouchableNativeFeedback,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import DictateChip from './DictateChip';
import Colors from '../../../constants/Colors';

const DictateMatchList = props => {
  const [allMatch, setAllMatch] = useState([]);
  const [allUnclear, setAllUnclear] = useState(props.results.unclear);

  useEffect(() => {
    var matches = props.results.match.slice(0);
    for (var i in matches) {
      matches[i].isSelected = true;
    }
    setAllMatch(matches);
  }, []);

  const toggleSelectedMatchHandler = (term, id, isSelected) => {
    if (term === 'match') {
      var matchList = allMatch.slice();
      const matchIndex = matchList.findIndex(match => match.id === id);
      matchList[matchIndex].isSelected = isSelected;
      setAllMatch(matchList);
    } else {
      var unclearList = allUnclear.slice();
      const unclearTermIndex = unclearList.findIndex(
        unclearTerm => unclearTerm.term === term,
      );
      const unclearIngList = unclearList[unclearTermIndex].matches.findIndex(
        unclearIng => unclearIng.id === id,
      );
      unclearList[unclearTermIndex].matches[unclearIngList].isSelected =
        isSelected;
      setAllUnclear(unclearList);
    }
  };

  let TouchableCmp = TouchableOpacity;
  if (Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
  }

  const addToPantryHandler = () => {
    var allSelected = [];
    var selectedMatch = allMatch.filter(ing => ing.isSelected === true);
    allSelected.push(...selectedMatch);
    for (const term of allUnclear) {
      var selectedUnclear = term.matches.filter(ing => ing.isSelected === true);
      allSelected.push(...selectedUnclear);
    }
    console.log(allSelected);

    props.onAddToPantry(allSelected);
  };

  return (
    <View style={styles.screen}>
      <View style={styles.overAllResultContainer}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.resultContainer}>
            <Text style={{color: Colors.primaryColor}}>
              Recognized ingredients
            </Text>
            <View style={styles.resultChipsContainer}>
              {allMatch.map((result, index) => (
                <DictateChip
                  term={'match'}
                  title={result.name}
                  key={result.id}
                  id={result.id}
                  isSelected={result.isSelected}
                  toggleSelectedMatch={toggleSelectedMatchHandler}
                />
              ))}
            </View>
            {allUnclear.map((unclearTerm, index) => (
              <View style={styles.unclearContainer} key={unclearTerm.term}>
                <Text
                  style={
                    styles.specifyTitle
                  }>{`Specify what '${unclearTerm.term}'`}</Text>
                <View style={styles.resultChipsContainer}>
                  {unclearTerm.matches.map((matchTerm, index) => (
                    <DictateChip
                      term={unclearTerm.term}
                      title={matchTerm.name}
                      key={matchTerm.id}
                      id={matchTerm.id}
                      isSelected={matchTerm.isSelected}
                      toggleSelectedMatch={toggleSelectedMatchHandler}
                    />
                  ))}
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
      <View style={styles.controlsContainer}>
        <View style={styles.touchable}>
          <TouchableCmp onPress={addToPantryHandler}>
            <View style={styles.buttonContainer}>
              <MaterialIcons name="playlist-add" size={20} color="white" />
              <Text style={styles.buttonLabel}>Add to pantry</Text>
            </View>
          </TouchableCmp>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    alignItems: 'center',
    height: '85%',
    width: '100%',
    paddingHorizontal: 5,
    paddingBottom: 0,
  },
  overAllResultContainer: {
    width: '100%',
    height: '80%',
    borderWidth: 1,
    borderColor: 'black',
    marginTop: 10,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: Colors.primaryColor,
    overflow: 'hidden',
  },
  scrollView: {
    flex: 1,
    backgroundColor: 'white',
  },
  resultChipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 3,
    padding: 5,
  },
  resultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerStyle: {
    marginHorizontal: 3,
    marginVertical: 3,
    overflow: 'hidden',
  },
  buttonSelectedStyle: {
    backgroundColor: Colors.primaryColor,
  },
  titleStyle: {
    fontSize: 11,
  },
  unclearContainer: {
    marginTop: 6,
  },
  specifyTitle: {
    marginLeft: 7,
    color: Colors.primaryColor,
  },
  controlsContainer: {
    height: '20%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
  },
  touchable: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.blue,
    height: 45,
    width: 150,
  },
  buttonLabel: {
    color: 'white',
    fontSize: 16,
    marginLeft: 3,
  },
});

export default DictateMatchList;

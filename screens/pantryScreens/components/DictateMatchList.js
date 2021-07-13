import React from 'react';
import {View, StyleSheet, Text, ScrollView} from 'react-native';
import {Chip} from 'react-native-elements';

import Colors from '../../../constants/Colors';

const DictateMatchList = props => {
  const allMatch = props.results.match;
  const allUnclear = props.results.unclear;
  return (
    <View style={styles.screen}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.resultContainer}>
          <Text style={{color: Colors.primaryColor}}>
            Recognized ingredients
          </Text>
          <View style={styles.resultChipsContainer}>
            {allMatch.map((result, index) => (
              <Chip
                key={`${result.id}-${index}`}
                title={result.name}
                containerStyle={styles.containerStyle}
                buttonStyle={styles.buttonSelectedStyle}
                titleStyle={styles.titleStyle}
                icon={{
                  name: 'checkmark',
                  type: 'ionicon',
                  size: 16,
                  color: 'white',
                }}
              />
            ))}
          </View>
          {allUnclear.map((unclearTerm, index) => (
            <View style={styles.unclearContainer} key={unclearTerm.term}>
              <Text style={styles.specifyTitle}>{`Specify what '${unclearTerm.term}'`}</Text>
              <View style={styles.resultChipsContainer}>
                {unclearTerm.matches.map((matchTerm, index) => (
                  <Chip
                    key={`${matchTerm.id}-${index}`}
                    title={matchTerm.name}
                    containerStyle={styles.containerStyle}
                    buttonStyle={styles.buttonSelectedStyle}
                    titleStyle={styles.titleStyle}
                    icon={{
                      name: 'checkmark',
                      type: 'ionicon',
                      size: 16,
                      color: 'white',
                    }}
                  />
                ))}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    width: '95%',
    height: '70%',
    borderWidth: 1,
    borderColor: 'black',
    marginVertical: 10,
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
    marginTop: 6
  },
  specifyTitle:{
    marginLeft: 7,
    color: Colors.primaryColor
  }
});

export default DictateMatchList;

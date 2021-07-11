import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  TouchableNativeFeedback,
  Platform,
  Button,
  ScrollView,
} from 'react-native';
import Voice from '@react-native-voice/voice';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {LinearProgress} from 'react-native-elements';
import {Chip} from 'react-native-elements';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import Colors from '../../constants/Colors';
import {TouchableOpacity} from 'react-native';

class DictateIngredientsScreen extends Component {
  state = {
    recognized: '',
    pitch: '',
    error: '',
    end: true,
    started: '',
    results: [],
    partialResults: [],
    ingCodeList: [],
  };

  constructor(props) {
    super(props);
    Voice.onSpeechStart = this.onSpeechStart;
    Voice.onSpeechRecognized = this.onSpeechRecognized;
    Voice.onSpeechEnd = this.onSpeechEnd;
    Voice.onSpeechError = this.onSpeechError;
    Voice.onSpeechResults = this.onSpeechResults;
    Voice.onSpeechPartialResults = this.onSpeechPartialResults;
  }

  static getDerivedStateFromProps(props, state) {
    var ingCodes = [];
    for (const ingCategory of props.ingredients) {
      ingCodes.push(ingCategory.ingredientCodes);
    }

    var allIngCodes = Array.prototype.concat.apply([], ingCodes);

    return {
      ingCodeList: allIngCodes,
    };
  }

  componentWillUnmount() {
    Voice.destroy().then(Voice.removeAllListeners);
  }

  componentDidMount() {
    this._startRecognizing();
  }

  onSpeechStart = e => {
    console.log('onSpeechStart: ', e);
    this.setState({
      started: true,
      recognized: false,
      error: false,
    });
  };

  onSpeechRecognized = e => {
    console.log('onSpeechRecognized: ', e);
    this.setState({
      recognized: true,
    });
  };

  onSpeechEnd = e => {
    console.log('onSpeechEnd: ', e);
    this.setState({
      end: true,
      started: false,
    });
  };

  onSpeechError = e => {
    console.log('onSpeechError: ', e);
    this.setState({
      error: true,
      started: false,
      end: true,
    });
  };

  onSpeechPartialResults = e => {
    console.log('onSpeechPartialResults: ', e);
    this.setState({
      partialResults: e.value,
    });
  };

  onSpeechResults = e => {
    var speechResult = e.value[0].trim();
    console.log('I heard: ' + speechResult);

    /** */
    var allMatch = [];
    while (speechResult.length != 0) {
      var remainingWordsArr = speechResult.split(/\s+/);
      var currentFirstWord = remainingWordsArr[0].toLowerCase();
      console.log('currentSpeech: ' + speechResult);
      console.log('currentWord: ' + currentFirstWord);
      const regex = new RegExp(
        `${currentFirstWord.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1')}`,
        'i',
      );
      const matches = this.state.ingCodeList.filter(
        ing => ing.name.search(regex) >= 0,
      );

      if (matches.length <= 0) {
        speechResult = speechResult.replace(currentFirstWord, '');
        speechResult = speechResult.trim();
        continue;
      }

      var hasMatch = false;
      for (const match of matches) {
        const currentName = match.name.toLowerCase();
        if (speechResult.includes(currentName)) {
          speechResult = speechResult.replace(currentName, '');
          hasMatch = true;
          allMatch.push(match);
          break;
        }
      }

      if (!hasMatch) {
        allMatch.push(...matches);
        speechResult = speechResult.replace(currentFirstWord, '');
      }

      console.log('has match: ' + hasMatch);

      speechResult = speechResult.trim();
    }

    console.log('AllMatch:' + allMatch);

    this.setState({
      results: allMatch,
      started: false,
      end: false
    });
  };

  _startRecognizing = async () => {
    this.setState({
      recognized: '',
      pitch: '',
      error: '',
      started: '',
      results: [],
      partialResults: [],
      end: true,
    });

    try {
      await Voice.start('en-US');
    } catch (e) {
      console.error(e);
    }
  };

  _stopRecognizing = async () => {
    try {
      await Voice.stop();
      await Voice.cancel();
    } catch (e) {
      console.error(e);
    }
  };

  render() {
    let TouchableCmp = TouchableOpacity;
    if (Platform.Version >= 21) {
      TouchableCmp = TouchableNativeFeedback;
    }
    return (
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          <View
            style={{
              padding: 0,
              margin: 0,
              justifyContent: 'center',
              alignContent: 'center',
            }}>
            <TouchableOpacity onPress={this._startRecognizing}>
              <Ionicons
                name="mic-circle-sharp"
                size={50}
                containerStyle={{borderWidth: 1, padding: 0, marginVertical: 0}}
                color={Colors.primaryColor}
              />
            </TouchableOpacity>
          </View>
          {this.state.started ? (
            <LinearProgress
              style={{width: '50%'}}
              color={Colors.primaryColor}
              variant="indeterminate"
            />
          ) : null}
          <Text
            style={{
              width: '50%',
              textAlign: 'center',
              color: Colors.gray,
            }}>{`${this.state.started ? 'Speak now' : `Tap to start`}`}</Text>

          {(this.state.error 
          || (this.state.results.length <=0 && (!this.state.started) && (!this.state.end) )) ? (
            <TouchableOpacity onPress={this._startRecognizing}>
              <View style={styles.errorMsgContainer}>
                <Text>
                  No supported ingredient recognized from speech. Please try
                  again.
                </Text>
              </View>
            </TouchableOpacity>
          ) : null}

          {this.state.results.length > 0 ? (
            <View style={styles.resultContainer}>
              <Text style={{color: Colors.primaryColor}}>
                Recognized ingredients
              </Text>
              <View style={styles.resultChipsContainer}>
                {this.state.results.map((result, index) => (
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
            </View>
          ) : null}

          {/* {this.state.started ? null : null} */}

          {this.state.results.length > 0 ? (
            <View style={styles.touchable}>
              <TouchableCmp onPress={() => {}}>
                <View style={styles.buttonContainer}>
                  <MaterialIcons name="playlist-add" size={20} color="white" />
                  <Text style={styles.buttonLabel}>Add to pantry</Text>
                </View>
              </TouchableCmp>
            </View>
          ) : null}
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: 'white',
    width: '100%',
  },
  container: {
    flex: 1,
    paddingTop: 5,
    paddingBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    backgroundColor: 'white',
  },
  buttonSelectedStyle: {
    backgroundColor: Colors.primaryColor,
  },
  titleStyle: {
    fontSize: 11,
  },
  containerStyle: {
    marginHorizontal: 3,
    marginVertical: 3,
    overflow: 'hidden',
  },
  resultChipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 3,
    borderColor: Colors.primaryColor,
    borderRadius: 8,
    width: '100%',
  },
  resultContainer: {
    marginVertical: 5,
    marginBottom: 10,
    borderWidth: 0.5,
    width: '90%',
    borderColor: Colors.primaryColor,
    paddingVertical: 8,
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  errorMsgContainer: {
    margin: 17,
    borderWidth: 0.5,
    borderColor: Colors.primaryColor,
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
  },
  touchable: {
    borderRadius: 8,
    overflow: 'hidden',
    width: '50%',
    justifyContent: 'center',
    alignContent: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.blue,
    paddingVertical: 8,
    width: '100%',
  },
  buttonLabel: {
    color: 'white',
    fontSize: 16,
    marginLeft: 3,
  },
});

export default DictateIngredientsScreen;

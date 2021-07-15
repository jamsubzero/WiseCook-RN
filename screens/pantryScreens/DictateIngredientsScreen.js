import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform,
  ScrollView,
} from 'react-native';
import Voice from '@react-native-voice/voice';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {LinearProgress} from 'react-native-elements';

import Colors from '../../constants/Colors';
import DictateMatchList from './components/DictateMatchList';
class DictateIngredientsScreen extends Component {
  state = {
    recognized: '',
    pitch: '',
    error: '',
    end: true,
    started: '',
    results: '',
    partialResults: [],
    ingCodeList: [],
    hasResult: false,
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
      ingCodes.push(...ingCategory.ingredientCodes);
    }

    return {
      ingCodeList: ingCodes,
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
    var previousFirstTwoWords = '';
    var previousFirstWord = '';
    var allMatch = [];
    var allUnclear = [];
    var allResult = [];
    var havingResult = false;
    while (speechResult.length > 0) {
      // while the dictated sentence has remaining words (> 1 because we include including remaining s)

      var remainingWordsArr = speechResult.split(/\s+/);
      console.log('currentSpeech: ' + speechResult);

      // Two words
      // TODO: consider plurals for two words
      if (remainingWordsArr.length > 1) {
        var currentFirstTwoWords = `${remainingWordsArr[0]} ${remainingWordsArr[1]}`;
        console.log('currentFirst 2 Words: ' + currentFirstTwoWords);

        if (previousFirstTwoWords === currentFirstTwoWords) {
          speechResult = speechResult.replace(currentFirstTwoWords, '');
          speechResult = speechResult.trim();
          continue;
        }
        previousFirstTwoWords = currentFirstTwoWords;

        const regexFirstTwoWords = new RegExp(
          `${currentFirstTwoWords.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1')}`,
          'i',
        );
        const twoWordMatches = this.state.ingCodeList.filter(
          ing => ing.name.search(regexFirstTwoWords) >= 0,
        );

        var hasMatchTwoWord = false;
        for (const match of twoWordMatches) {
          const currentMatchName = match.name.toLowerCase();
          if (currentMatchName.includes(currentFirstTwoWords)) {
            hasMatchTwoWord = true;
            allMatch.push(match);
            break;
          }
        }

        if (hasMatchTwoWord) {
          speechResult = speechResult.replace(currentFirstTwoWords, '');
          speechResult = speechResult.trim();
          continue;
        }
      }

      // One word
      var currentFirstWord = remainingWordsArr[0].toLowerCase();
      var currentOriginalWord = currentFirstWord;
      console.log('currentFirst Original Word: ' + currentOriginalWord);

      if (
        currentFirstWord === 'es' ||
        currentFirstWord === 's' ||
        currentFirstWord === 'ies' ||
        currentFirstWord === 'of' ||
        currentFirstWord === 'in' ||
        currentFirstWord === 'and' ||
        currentFirstWord === 'or' ||
        currentFirstWord === 'de' ||
        currentFirstWord === 'with'||
        currentFirstWord === 'for'
      ) {
        speechResult = speechResult.replace(currentFirstWord, '');
        speechResult = speechResult.trim();
        continue;
      }

      if (currentOriginalWord.slice(-3) === 'ies') {
        // when user dictated plural with 'ies'
        currentFirstWord = currentOriginalWord.slice(0, -3);
      } else if (currentOriginalWord.slice(-2) === 'es') {
        // when user dictated plural with 'es'
        currentFirstWord = currentOriginalWord.slice(0, -2);
      } else if (currentOriginalWord.slice(-1) === 's') {
        // when user dictated plural with 's'
        currentFirstWord = currentOriginalWord.slice(0, -1);
      }

      console.log('currentFirst Word: ' + currentFirstWord);

      if (previousFirstWord === currentOriginalWord) {
        speechResult = speechResult.replace(currentOriginalWord, '');
        speechResult = speechResult.trim();
        continue;
      }
      previousFirstWord = currentFirstWord;

      const regexFirstWord = new RegExp(
        `${currentFirstWord.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1')}`,
        'i',
      );
      const matches = this.state.ingCodeList.filter(
        ing => ing.name.search(regexFirstWord) >= 0,
      );

      if (matches.length <= 0) {
        speechResult = speechResult.replace(currentOriginalWord, '');
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
        allUnclear.push({term: currentOriginalWord, matches: matches});
        speechResult = speechResult.replace(currentOriginalWord, '');
      }

      console.log('has match: ' + hasMatch);

      speechResult = speechResult.trim();
    }

    console.log('AllMatch:' + allMatch);

    allResult.match = allMatch;

    allResult.unclear = allUnclear;

    if (allUnclear.length > 0 || allMatch.length > 0) {
      havingResult = true;
    }

    this.setState({
      results: allResult,
      started: false,
      end: false,
      hasResult: havingResult,
    });
  };

  _startRecognizing = async () => {
    this.setState({
      recognized: '',
      pitch: '',
      error: '',
      started: '',
      results: '',
      partialResults: [],
      end: true,
      hasResult: false,
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

  _onAddToPantryHandler = (selectedDictate) => {
    this.props.onAddToPantry(selectedDictate);
  } 

  render() {
    let TouchableCmp = TouchableOpacity;
    if (Platform.Version >= 21) {
      TouchableCmp = TouchableNativeFeedback;
    }
    return (
      <View style={styles.container}>
        <View style={styles.topControlsContainer}>
          <View
            style={styles.micContainer}>
            <TouchableOpacity onPress={this._startRecognizing}>
              <Ionicons
                name="mic-circle-sharp"
                size={50}
                containerStyle={{borderWidth: 1, padding: 0, marginVertical: 0}}
                color={Colors.primaryColor}
              />
            </TouchableOpacity>
          </View>
          <Text
            style={{
              width: '50%',
              textAlign: 'center',
              color: Colors.gray,
            }}>{`${this.state.started ? 'Speak now' : `Tap to start`}`}</Text>
        </View>
        {this.state.started ? (
          <LinearProgress
            style={{width: '50%', marginTop: 5}}
            color={Colors.primaryColor}
            variant="indeterminate"
          />
        ) : null}

        {this.state.error ||
        (!this.state.hasResult && !this.state.started && !this.state.end) ? (
          <TouchableOpacity onPress={this._startRecognizing}>
            <View style={styles.errorMsgContainer}>
              <Text>
                No supported ingredient recognized from speech. Please try
                again.
              </Text>
            </View>
          </TouchableOpacity>
        ) : null}

        {this.state.hasResult ? (
          <DictateMatchList results={this.state.results} onAddToPantry={this._onAddToPantryHandler} />
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignContent: 'center',
    backgroundColor: 'white',
  },
  errorMsgContainer: {
    margin: 17,
    borderWidth: 0.5,
    borderColor: Colors.primaryColor,
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
  },
  topControlsContainer: {
    alignItems: 'center',
    height: '15%',
  },
  micContainer:{
    padding: 0,
    margin: 0,
    justifyContent: 'center',
    alignContent: 'center',
  }
});

export default DictateIngredientsScreen;

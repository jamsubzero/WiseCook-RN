import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import {Chip} from 'react-native-elements';

import Colors from '../../../constants/Colors';

export default class DictateChip extends Component {
  render() {
    const onIngToggleHandler = () => {
      this.props.toggleSelectedMatch(
        this.props.term,
        this.props.id,
        !this.props.isSelected,
      );
    };

    if (this.props.isSelected) {
      return (
        <Chip
          title={this.props.title}
          onPress={onIngToggleHandler}
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
      );
    }

    return (
      <Chip
        title={this.props.title}
        onPress={onIngToggleHandler}
        containerStyle={styles.containerStyle}
        buttonStyle={styles.buttonNotSelectedStyle}
        titleStyle={styles.titleStyle}
      />
    );
  }
}

const styles = StyleSheet.create({
  buttonSelectedStyle: {
    backgroundColor: Colors.primaryColor,
  },
  buttonNotSelectedStyle: {
    backgroundColor: Colors.lightGray,
  },
  titleStyle: {
    fontSize: 11,
  },
  containerStyle: {
    marginHorizontal: 3,
    marginVertical: 3,
    overflow: 'hidden',
  },
});

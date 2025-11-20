import React from 'react';
import {TextInput} from 'react-native';
import {COLORS} from '../constants';

const DefaultTextInput = ({style, ...props}) => {
  const defaultStyles = {
    backgroundColor: COLORS.lightGray,
    borderRadius: 5,
    padding: 10,
    margin: 10,
  };

  const mergedStyles = {...defaultStyles, ...style};

  return <TextInput {...props} style={mergedStyles} />;
};

export default DefaultTextInput;

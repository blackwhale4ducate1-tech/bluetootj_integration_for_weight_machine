import React from 'react';
import {TouchableOpacity} from 'react-native';
import {COLORS} from '../constants';

const DefaultTouchableOpacity = ({children, ...props}) => {
  const defaultStyles = {
    backgroundColor: COLORS.primary,
    borderRadius: 5,
    padding: 10,
    margin: 10,
    alignItems: 'center',
  };

  const mergedStyles = {...defaultStyles, ...props.style};

  return (
    <TouchableOpacity {...props} style={mergedStyles}>
      {children}
    </TouchableOpacity>
  );
};

export default DefaultTouchableOpacity;

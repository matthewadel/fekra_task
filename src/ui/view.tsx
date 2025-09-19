import React from 'react';
import { View as RNView } from 'react-native';

import { iView } from '@/types';
import { handleRtl } from '@/ui';

export const View = (props: iView) => {
  let { noDirectionChange, style, showStyle } = props;

  return (
    <RNView
      {...props}
      style={handleRtl(style || {}, noDirectionChange, showStyle)}
    />
  );
};

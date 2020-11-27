import 'react-native';
import React from 'react';

import { checkOutdatedVersion } from '../Home.utils';

describe('Check outdated version', function () {
  it('return true', function () {
    expect(checkOutdatedVersion('4.0.0', '3.1.2.3')).toBe(true);
    expect(checkOutdatedVersion('123', '3.1.2.3')).toBe(true);
  });

  it('return false', function () {
    expect(checkOutdatedVersion('3.10.0', '4.0.0')).toBe(false);

  });
});

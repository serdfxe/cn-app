import { theme } from 'antd';
import { forEach, includes, isNumber, isString, kebabCase } from 'lodash';
import React from 'react';

function saveToken(value, tokenName) {
  const isPrivateField = tokenName.startsWith('_');
  if (isPrivateField) return;
  const variableName = `--antd-${kebabCase(tokenName)}`;
  if (isString(value)) document.documentElement.style.setProperty(variableName, value);
  if (isNumber(value)) {
    const propertyValue = isPureNumberProperty(tokenName) ? value : `${value}px`;
    document.documentElement.style.setProperty(variableName, propertyValue);
  }
}

const isPureNumberProperty = (tokenName) =>
  includes(tokenName, 'zIndex') ||
  includes(tokenName, 'Weight') ||
  includes(tokenName, 'motion') ||
  includes(tokenName, 'opacity') ||
  includes(tokenName, 'lineHeight');

export const CssTokenBridge = () => {
  const { token } = theme.useToken();
  React.useLayoutEffect(() => {
    forEach(token, saveToken);
  }, [ token ]);

  return null;
};
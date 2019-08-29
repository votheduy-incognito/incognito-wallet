// @flow
import {type Element, Component} from 'react';

export type StepIndicatorProps={
  containerStyle?: any,
  renderStepIndicator: (position: Number, stepStatus: String)=>Element<typeof Component>,
  stepCount?: number,
  stepStyle?: any,
  currentPage:number,
  labels:Array<String>
}
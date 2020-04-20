import { NavigationActions, StackActions } from 'react-navigation';

let _navigator;

function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;

}

function navigate(routeName, params) {
  try {
    _navigator &&
   _navigator.dispatch(
     NavigationActions.navigate({ routeName, params })
   );
  } catch (err) {
    // alert(LogManager.parseJsonObjectToJsonString(err));
  }
}

function goBack() {
  _navigator && _navigator.dispatch(NavigationActions.back());
}

function pop() {
  _navigator && _navigator.dispatch(StackActions.pop());
}

function setParams(params, key) {
  _navigator && _navigator.dispatch(NavigationActions.setParams({ params, key }));
}

function popToTop() {
  const resetAction = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'Home' })],
  });
  _navigator && _navigator.dispatch(resetAction);
}

function getNavigator() {
  return _navigator;
}
// add other navigation functions that you need and export them

export default {
  navigate,
  setTopLevelNavigator,
  goBack,
  setParams,
  getNavigator,
  pop,
  popToTop,
};
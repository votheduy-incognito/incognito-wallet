import nameList from '@src/resources/randomNameDict';

const getName = () => nameList[Math.round(Math.random() * nameList.length)];

export default ({ excludes } = {}) => {
  let name;

  if (excludes && excludes.length) {
    do {
      name = getName();
    } while (name && excludes.includes(name));
  }

  return name;
};
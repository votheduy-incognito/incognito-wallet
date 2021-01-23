export const textType = {
  normal: 1,
  bold: 2,
  link: 3
};

export const sections = [
  [{
    text: 'Some Node displays are currently undergoing maintenance. Sorry for the inconvenience! If you cannot currently see your Nodes, please don’t worry. ',
    type: textType.normal
  }, {
    text: 'They are still running, and will be eligible to earn.',
    type: textType.bold
  }], [{
    text: 'Your display will be back ASAP. In the meantime, feel free to reach out to us on the ',
    type: textType.normal
  }, {
    text: 'forum',
    link: 'https://we.incognito.org/',
    type: textType.link,
  }, {
    text: ', or at ',
    type: textType.normal
  }, {
    text: 'go@incognito.org',
    link: 'mailto:go@incognito.org?',
    type: textType.link
  }, {
    text:  '. We’re happy to answer any questions you may have.',
    type: textType.normal
  }], [{
    text: 'P.S. you can always track your Nodes with one of our ',
    type: textType.normal
  }, {
    text: 'community built tools',
    link: 'https://we.incognito.org/t/community-built-node-management-tools/9440',
    type: textType.link
  }, {
    text: '. Special thanks to all builders!',
    type: textType.normal
  }]
];
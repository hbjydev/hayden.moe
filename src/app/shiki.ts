const simpleColor = (scope: string | string[], color: string) => ({
  scope,
  settings: { foreground: color },
});

export const oxocarbon = {
  displayName: 'Oxocarbon',
  name: 'oxocarbon',

  colors: {
    'editor.background': '#161616',
    'editor.foreground': '#f2f4f8',
  },

  tokenColors: [
    simpleColor([
      'comment',
      'punctuation.definition.comment',
      'string.comment',
    ], '#525252'),

    simpleColor('punctuation', '#3ddbd9'),

    simpleColor(['string', 'punctuation.definition.string'], '#be95ff'),

    simpleColor('constant', '#ee5396'),
    simpleColor('constant.numeric', '#82cfff'),
    simpleColor('constant.language', '#08bdba'),

    simpleColor(['keyword.control', 'keyword.other'], '#78a9ff'),
    simpleColor('keyword.operator', '#3ddbd9'),

    simpleColor('variable.parameter', '#78a9ff'),
    simpleColor('variable.language', '#78a9ff'),
    simpleColor('variable.property', '#ee5396'),
    simpleColor('variable', '#be95ff'),

    simpleColor('type', '#78a9ff'),

    simpleColor([
      'storage.type',
      'storage.modifier',
      'entity.name',
      'support.variable'
    ], '#78a9ff'),
  ],
};

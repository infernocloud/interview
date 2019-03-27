const LevelManager = require('./LevelManager');

describe('default level schema', () => {
  const levelSchema = {
    levels: [
      {
        _id: 'level_1',
        name: 'First Level',
        unlocks: [
          'level_2',
        ],
        first: true,
      },
      {
        _id: 'level_2',
        name: 'Second Level',
        unlocks: [],
        first: false,
      },
      {
        _id: 'level_3',
        name: 'Inaccessible Level',
        unlocks: ['level_4'],
        first: false,
      },
      {
        _id: 'level_4',
        name: 'Second Inaccessible Level',
        unlocks: [],
        first: false,
      },
    ],
    userLevelStates: [
      {
        _id: 'state_1',
        level: 'level_1',
        state: 'complete',
      },
    ],
  };
  const myLevelManager = new LevelManager(levelSchema);

  test('level schema matches after constructor', () => {
    expect(myLevelManager.levelSchema).toEqual(levelSchema);
  });

  test('builds a correct level index', () => {
    const testIndex = {
      level_1: 0,
      level_2: 1,
      level_3: 2,
      level_4: 3,
    };
    expect(myLevelManager.levelIndex).toEqual(testIndex);
  });

  test('returns valid level IDs', () => {
    const testSet = new Set([
      'level_1',
      'level_2',
      'level_3',
      'level_4',
    ]);
    expect(myLevelManager.validLevels).toEqual(testSet);
  });

  test('returns completed level IDs', () => {
    expect(myLevelManager.getCompleted()).toEqual(['level_1']);
  });

  test('returns completed level names', () => {
    expect(myLevelManager.getCompletedNames()).toEqual(['First Level']);
  });

  test('returns accessible level names', () => {
    expect(myLevelManager.getAccessible()).toEqual(['First Level', 'Second Level']);
  });

  test('returns inaccessible level names', () => {
    expect(myLevelManager.getInaccessible()).toEqual(['Inaccessible Level', 'Second Inaccessible Level']);
  });
});

describe('invalid level schema', () => {
  const levelSchema = {};

  test('throws with invalid level schema', () => {
    expect(() => {
      const myLevelManager = new LevelManager(levelSchema);
      return myLevelManager;
    }).toThrow();
  });
});

class LevelManager {
  constructor(levelSchema = {}) {
    if (!levelSchema.levels || levelSchema.length === 0) {
      throw new Error("Invalid level schema");
    }

    this.levelSchema = levelSchema;
    this.levelIndex = {};
    this.validLevels = new Set();
    this.completedLevels = [];

    this.indexLevels();
    this.cacheValidLevels();
    this.cacheCompletedLevels();
  }

  // Builds an object indexing each level _id to the array position in levelSchema.levels
  indexLevels() {
    this.levelIndex = this.levelSchema.levels.reduce(
      (accumulator, current, currentIndex) => {
        accumulator[current._id] = currentIndex;
        return accumulator;
      },
      {}
    );
  }

  // Builds a set (unique array) of all level _ids from the schema
  cacheValidLevels() {
    this.validLevels = new Set(this.levelSchema.levels.map(({ _id }) => _id));
  }

  // Cache level IDs for completed levels for easier comparison
  cacheCompletedLevels() {
    this.completedLevels = this.getCompleted();
  }

  // Get the index of the level object in this.levelSchema.levels[]
  getLevelIndex(_id) {
    // Return -1 if level key is invalid
    if (!(_id in this.levelIndex)) {
      return -1;
    }

    return this.levelIndex[_id];
  }

  // Filters an array of level _ids down to only those that are valid
  filterValidLevels(levels) {
    const isValidLevel = _id => this.validLevels.has(_id);
    return levels.filter(isValidLevel);
  }

  // Return an array containing the name of each level in the argument array
  getNames(levels) {
    return levels.map(levelID => {
      const levelIndex = this.getLevelIndex(levelID);

      // Can't map invalid level IDs to a name
      if (levelIndex < 0) {
        return "";
      }

      return this.levelSchema.levels[levelIndex].name;
    });
  }

  // Returns an array with the _id of all valid levels that have been completed
  getCompleted() {
    const completedLevels = this.levelSchema.userLevelStates.filter(
      ({ state }) => state === "complete"
    );
    const completedLevelIDs = completedLevels.map(({ level }) => level);

    // Need to ensure that the level IDs are valid from the level schema?
    const validatedCompletedLevelIDs = this.filterValidLevels(
      completedLevelIDs
    );

    return validatedCompletedLevelIDs;
  }

  // Returns the names of completed levels
  getCompletedNames() {
    return this.getNames(this.completedLevels);
  }

  // Given an array of level IDs, filters down to only those levels that have been completed
  filterCompletedLevels(levels = []) {
    return levels.filter(levelID => this.completedLevels.includes(levelID));
  }

  // Return an array with _id of each level that is currently accessible to a user
  // Return any levels that are in unlocks[] of accessible and [completed] levels (recurse until we reach end of tree)
  // @TODO do we care about whether the level is completed or not? Is this total possible paths, or user accessibility?
  // If actualProgression is true, we only consider paths after levels that have been completed
  getAccessible(actualProgression = true) {
    // Return any level that is marked as first: true (entry points)
    const firstLevels = this.levelSchema.levels.filter(({ first }) => first);
    const firstLevelIDs = firstLevels.map(({ _id }) => _id);

    if (actualProgression) {
      // Only completed levels should be traversed
      // @TODO If a level is completed is it still accessible?
      const completedFirstLevels = this.filterCompletedLevels(firstLevelIDs);
      return [
        ...firstLevelIDs,
        ...this.traverse(completedFirstLevels, actualProgression)
      ];
    }

    return [
      ...firstLevelIDs,
      ...this.traverse(firstLevelIDs, actualProgression)
    ];
  }

  getAccessibleNames(actualProgression = true) {
    return this.getNames(this.getAccessible(actualProgression));
  }

  // Return an array with _id of each level that is not currently accessible to a user
  getInaccessible(actualProgression = true) {
    const accessible = this.getAccessible(actualProgression);
    return [...this.validLevels].filter(
      levelID => !accessible.includes(levelID)
    );
  }

  getInaccessibleNames(actualProgression = true) {
    return this.getNames(this.getInaccessible(actualProgression));
  }

  // Get the unlocks for each level in levels,
  // Recursively travel down those subsequent level unlocks until reaching an empty unlocks array
  // If actualProgression is true, we will only recurse down the unlocks of a completed level
  traverse(levels = [], actualProgression = true) {
    if (levels.length === 0) {
      return [];
    }

    // Get the unlocks for each level in levels[],
    // These are added to the return array immediately.
    const unlocks = levels.reduce((accumulator, current) => {
      const levelIndex = this.getLevelIndex(current);

      // If level is invalid reference, don't traverse it
      if (levelIndex < 0) {
        return accumulator;
      }

      accumulator.push(...this.levelSchema.levels[levelIndex].unlocks);
      return accumulator;
    }, []);

    // If actualProgression, then filter this array of unlocks to only completed levels to continue with traverse()
    if (actualProgression) {
      // Only completed levels should be traversed further
      const completedUnlocks = this.filterCompletedLevels(unlocks);
      return [
        ...unlocks,
        ...this.traverse(completedUnlocks, actualProgression)
      ];
    }

    return [...unlocks, ...this.traverse(unlocks, actualProgression)];
  }
}

module.exports = LevelManager;

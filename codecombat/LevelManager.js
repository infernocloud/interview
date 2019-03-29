/* eslint-disable no-underscore-dangle */
class LevelManager {
  constructor(levelSchema = {}) {
    if (!levelSchema.levels || levelSchema.length === 0) {
      throw new Error('Invalid level schema');
    }

    this.levelSchema = levelSchema;
    this.indexLevels();
    this.cacheValidLevels();
  }

  // Builds an object indexing each level _id to the array position in levelSchema.levels
  indexLevels() {
    this.levelIndex = this.levelSchema.levels.reduce((accumulator, current, currentIndex) => {
      accumulator[current._id] = currentIndex;
      return accumulator;
    }, {});
  }

  // Builds a set (unique array) of all level _ids from the schema
  cacheValidLevels() {
    this.validLevels = new Set(this.levelSchema.levels.map(({ _id }) => _id));
  }

  // Filters an array of level _ids down to only those that are valid
  filterValidLevels(levels) {
    const isValidLevel = _id => this.validLevels.has(_id);
    return levels.filter(isValidLevel);
  }

  // Return an array containing the name of each level in the argument array
  getNames(levels) {
    return levels.map((levelID) => {
      const levelIndex = this.levelIndex[levelID];
      return this.levelSchema.levels[levelIndex].name;
    });
  }

  // Returns an array with the _id of all valid levels that have been completed
  getCompleted() {
    const completedLevels = this.levelSchema.userLevelStates.filter(({ state }) => state === 'complete');
    const completedLevelIDs = completedLevels.map(({ level }) => level);
    
    // Need to ensure that the level IDs are valid from the level schema?
    const validatedCompletedLevelIDs = this.filterValidLevels(completedLevelIDs);

    return validatedCompletedLevelIDs;
  }

  // Returns the names of completed levels
  getCompletedNames() {
    return this.getNames(this.getCompleted());
  }

  // Return an array with _id of each level that is currently accessible to a user
  // Return any levels that are in unlocks[] of accessible and [completed] levels (recurse until we reach end of tree)
  // @TODO do we care about whether the level is completed or not? Is this total possible paths, or user accessibility?
  // 1 hr 28ish minutes to here
  getAccessible(returnNames = false) {
    // Return any level that is marked as first: true (entry points)
    const firstLevels = this.levelSchema.levels.filter(({ first }) => first);
    const firstLevelIDs = firstLevels.map(({ _id }) => _id);
    const completedLevels = this.getCompleted();

    if (returnNames) {
      return [...this.getNames(firstLevelIDs)];
    }

    return [...firstLevelIDs];
  }
  
  // Return an array with _id of each level that is not currently accessible to a user
  getInaccessible() {
    const accessible = this.getAccessible();
    return [];
  }
}

module.exports = LevelManager;

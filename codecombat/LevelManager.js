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
    this.levelIndex = {};
    this.levelSchema.levels.forEach(({ _id }, index) => {
      this.levelIndex[_id] = index;
    });
  }

  // Builds a set (unique array) of all level _ids from the schema
  cacheValidLevels() {
    this.validLevels = new Set(this.levelSchema.levels.map(({ _id }) => _id));
  }

  // Returns an array with the _id of all valid levels that have been completed
  getCompleted() {
    const completedLevels = this.levelSchema.userLevelStates.filter(item => item.state === 'complete');
    const completedLevelIDs = completedLevels.map(item => item.level);
    
    // Need to ensure that the level IDs are valid from the level schema?
    const validatedCompletedLevelIDs = completedLevelIDs.filter((item) => {
      return this.validLevels.has(item);
    });

    return validatedCompletedLevelIDs;
  }

  // Returns the names of completed levels
  getCompletedNames() {
    return this.getCompleted().map((item) => {
      const levelIndex = this.levelIndex[item];
      return this.levelSchema.levels[levelIndex].name;
    });
  }

  // Return an array with _id of each level that is currently accessible to a user
  // Return any level that is marked as first: true (entry points)
  // Return any levels that are in unlocks[] of accessible and [completed] levels (recurse until we reach end of tree)
  // @TODO do we care about whether the level is completed or not? Is this total possible paths, or user accessibility?
  getAccessible() {
    return [];
  }
  
  // Return an array with _id of each level that is not currently accessible to a user
  getInaccessible() {
    const accessible = this.getAccessible();
    return [];
  }
}

module.exports = LevelManager;

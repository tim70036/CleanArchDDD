## Feature Description
Clearly and concisely describe the feature.

## Affected Domain
Briefly list the affected domain of this feature change.

## Covered Tests
- [ ] Tested by owner
- [ ] Tested with frontend
- [ ] Tested with QA

## API Changes
- [ ] No api change in this mr
- [ ] [There are api changes in this mr, and I have make sure it follows the api vesion guideline.](https://game-soul-technology.atlassian.net/wiki/spaces/GAM/pages/1213956097/API+Versioning+Guideline)

## List all changed apis, including new add or version change.

### Review code again and check the following rules.
All usecases, db/redis operations follow the following rules: 
 - [ ] Wrapped in try-catch block
 - [ ] Await before return.
 - [ ] Commit and rollback correctly.
 - [ ] [Use constant memory when data amount arise.](https://game-soul-technology.atlassian.net/wiki/spaces/~618522111/pages/1210089475/20220227+Crash)
 - [ ] [Don't use redis keys command in production.](https://redis.io/commands/keys/)





## Bug Description
Clearly and concisely describe the problem.

## Root Cause
Briefly describe the root cause and analysis of the problem.

## Reproduce Steps
List down the reproduce step of this issue.

## Solution Description
Describe your code changes in detail. Explain the technical solution you have provided and how it fix the issue.

## Covered Tests
- [ ] Tested by owner
- [ ] Tested with frontend
- [ ] Tested with QA

## Affected Domain
Briefly list the affected domain of this feature change.

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

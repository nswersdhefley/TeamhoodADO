This was not created by Teamhood and is in no way supported by Teamhood.

## Steps to run (in nswersteamhoodtaskcreate)
1. npm install
2. tsc
3. node index.js

Probably will need a few environmental variables set. 

At least:
 - INPUT_teamhoodapikey
 - INPUT_teamhoodbaseurl
 - INPUT_teamhoodboardid
 - INPUT_teamhoodrowid
 - INPUT_teamhoodtasktitle
 - INPUT_teamhoodworkspaceid

## Steps to publish
1. Increase version in vss-extension.json
2. Increase version in task.json
3. Create Package: `tfx extension create --manifest-globs vss-extension.json`
4. Upload to https://marketplace.visualstudio.com/manage/publishers/[organization]
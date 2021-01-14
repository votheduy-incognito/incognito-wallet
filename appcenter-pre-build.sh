#!/usr/bin/env bash

echo "
PASSWORD_SECRET_KEY=$PASSWORD_SECRET_KEY
PASSPHRASE_WALLET_DEFAULT=$PASSPHRASE_WALLET_DEFAULT
API_MINER_URL=$API_MINER_URL
PASS_HOSPOT=$PASS_HOSPOT
NODE_PASSWORD=$NODE_PASSWORD
NODE_USER_NAME=$NODE_USER_NAME
" > .env

#IOS_BUILD_CONFIGURATION=Test

if [[ ! -z "${IOS_BUILD_CONFIGURATION}" ]]; then
  FILE=ios/Incognito.xcworkspace/xcshareddata/xcschemes/Incognito.xcscheme
  BACKUP_FILE=Incognito.xcscheme.bak
  sed '75 s/buildConfiguration = ".*"/buildConfiguration = "'$IOS_BUILD_CONFIGURATION'"/' $FILE > $BACKUP_FILE
  mv $BACKUP_FILE $FILE
fi

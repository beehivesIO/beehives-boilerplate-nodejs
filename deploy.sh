#!/bin/bash

red=`tput setaf 1`
green=`tput setaf 2`
reset=`tput sgr0`

function title {
    echo -n "$2"
    printf '%*s\n' "${COLUMNS:-$(tput cols)}" '' | tr ' ' =
    echo "====== $1"
    printf '%*s\n' "${COLUMNS:-$(tput cols)}" '' | tr ' ' =
    echo -n ${reset}
}

function abort() {
    local exit_status=${1:-$?}
    if [ $exit_status -eq 0 ]
    then
	exit 0
    fi
    title "An error has occured!" $red
    exit $exit_status
}
trap 'abort' 0
set -e



title "Checking git status..." $green
if [[ "`git status --porcelain`" ]]
then
  title "You have to commit before you can deploy!" $red
  exit 1
fi


title "Running tests..." $green
npm run test


title "Bumping version..." $green
npm version patch


title "Pushing to git..." $green
git push origin
git push origin --tags


title "Publishing to npm" $green
npm publish

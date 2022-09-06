#!/usr/bin/env bash

set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

red='\x1B[0;31m'
plain='\x1b[0m'

test $(which yarn)
if [ $? != "0" ]; then
    echo -e "\n\r\n\r${red}yarn not found: please install yarn from https://yarnpkg.com/${plain}\n\r"
    echo -e "Yarn is not required for the application (but is for this script)"
    echo -e "Packages can be manually installed with npm\n\r\n\r"

    exit 1
fi

printf "\n\rSetting up client side dependencies... \n\r\n\r"

NODE_MAJOR_VERSION=$(node -v | cut -d "." -f 1)
DESIRED_NODE_VERSION=$(cat "${DIR}/../.nvmrc")

if [[ "${NODE_MAJOR_VERSION}" != *"${DESIRED_NODE_VERSION}"  ]]; then
  echo -e "${red}Your node version ${NODE_MAJOR_VERSION}" does not match "${DESIRED_NODE_VERSION}"
  echo -e "Please run 'nvm use' to get the desired node version${plain}"
  exit 1
fi

printf "\n\rInstalling NPM packages via yarn... \n\r\n\r"

yarn

printf "\n\Compiling Javascript... \n\r\n\r"

yarn build

printf "\n\rDone.\n\r\n\r"

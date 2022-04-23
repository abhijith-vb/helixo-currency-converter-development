#!/bin/bash
# This is myApp/scripts/linkAll.sh
# List all your local libraries in this array
libs=( "@helixo" )
appDir=$(pwd) # dir of where script is called
packDir="${appDir}/packages"
for i in "${libs[@]}"
do
    if [ ! -d "$appDir/node_modules/$i" ]; then
        ln -sf "$packDir/$i" "$appDir/node_modules"
        echo "$i -> Synced!"
    else
        echo "$i -> Was already synced"
    fi
done
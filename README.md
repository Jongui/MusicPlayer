# MusicPlayer
This project if part of a research I've made for the program of mobile application development I am making at the Universidade Tecnológica Federal do Paraná. It is intended to allow students of all ages to make music collectively using the mobile application in connection with a Raspberry Pi 3.

## Installation
This repository is not ready to use. For developing one have to follow these steps:

### Create cordova project
On the folder you want to save the project create a new cordova project

`cordova create MusicPlayer`

### Delete tracked files
On the root folder of the project, delete the file config.xml and the folder www/.

### Add remote repository
At this point, you created the project, added the platforms and the plugins. Next, is time to create a git repository and link it to the GitHub repository.

First, on the root folder of the project, initialize git.

`git init`

Second, add git remote

`git remote add origin https://github.com/Jongui/MusicPlayer.git`

At last, pull the files from the remote repository into your local project

`git pull origin master`

### Add plugins
These are the most important steps to take, since they will install the plugins used for the application.

```
cordova plugin add cordova-plugin-http
cordova plugin add cordova-sqlite-storage
cordova plugin add cordova-plugin-globalization
cordova plugin add cordova-plugin-dialogs
```

### Add platforms
Inside the root folder of the Cordova project you just created add the Android and iOS platforms.

```
cordova add platform android
cordova add platform ios
```

And that is! Now you have the development environment set!

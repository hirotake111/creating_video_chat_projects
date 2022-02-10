# Projects - Create 🎥 Video Chat App 🎥

## Overview

The purpose of this repository is to learn how to create video chat app on top of WebRTC.

- [1st Project](#1st-project)

- [2nd Project](#2nd-project)

---

## 🎉 1st Project 🎉

### Overview

![1st project demo](/images/demo_1.gif)

The purpose of this project is to get a grasp on how WebRTC works. Therefore there are many spaces I should refactor.

### Approach Taken

Fist of all I watched [this tutorial on YouTube](https://www.youtube.com/watch?v=oxFr7we3LC8) and learn the basic logic of signaling and stream. Then I added some nice spice (below) to it

- Rewrite code in [TypeScript](https://www.typescriptlang.org/)

- [Dockernize server](https://www.docker.com/)

- GitHub Actions to automatically create/push Docker image

- Display available user list (so that user doesn't have to type other user's ID maually)

- Sign in screen / Calling screen

- Small video screen that shows user itself

- Audio/Video on/off button

## 🎉 2nd Project 🎉

### TODO

- Multiple users can join one meeting (not P2P, use TURN server)

- Participants can send chat messages

- Authentication (in order to create a meeting)

- But anyone can join meeting (using meeting link)

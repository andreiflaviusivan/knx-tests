# KNX Tests
Comparison between KNX-IP and KNX libraries for NodeJS

This repo demonstrates how to:

1. Read the temperature from a sensor
1. Write the desired room temperature to a group address
1. Read the confirmation again so that the room temperature is changed

This is accomplished by using two KNX over IP libraries in NodeJS:
* https://www.npmjs.com/package/knx-ip - index.js
* https://www.npmjs.com/package/knx - index2.js

You can read more in this [blog post](https://blog.mindgaze.tech/?p=617). It doesn't show how to configure the KNX network and stuff, it's beyong the purpose of the article. It explains how to use the libraries and differences between them.

## How to run

First don't forget to run `npm i` after you clone the repo.

### Run the KNX-IP one
`node index.js`

### Run the KNX one
`node index2.js`

## Contributions

Any contribution is welcome. Feel free to comment in the [blog post](https://blog.mindgaze.tech/?p=617) as well or [contact me](https://www.mindgaze.tech/Home/Contact)!

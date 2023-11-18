---
sidebar_position: 5
---

# Further work

## Worldcoin

- Proper Worldcoin verification integration
Our project integrates Worldcoin signature verification to prevent bots partaking in the game, we were however limited in integration that we had committed to deploying on the [Scroll Network](https://scroll.io/) and at the time of hacking Worldcoins onchain verification wasn't on the scroll network

- Use Worldcoin to prevent sybil attack auction price manipulation
It is possible for a user to act as many accounts and try and manipulate the price of the auction to inflate their own value

- Improved battle mechanics
Currently the battle elimination criteria is that randomly the countries are dropped from the game daily. As we couldn't use VRF or equivalent on Scroll we used the previous block hash for randomness which is technically manipulatable by miners. This and incorporating value to some weighted values to countries such as the [global fire power index](https://www.globalfirepower.com/countries-listing.php) or something like carbon emissions per capita as a proxy for how sustainable a country is. 

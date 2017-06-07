# Gambit

This repo contains Solidity smart contract code to issue simple, ERC20-compliant tokens on Ethereum.

The ERC20.sol contract is the interface for the standard proposed in issue [#20](https://github.com/ethereum/EIPs/issues/20).  

The base is Token.sol which ONLY implements the core ERC20 standard functionality.

Gambit.sol is an implementation with all of the extra functionalityexample of a token that has optional extras fit for your issuing your own tokens, to be mainly used by other humans. It includes:  

1. Initial Finite Supply (upon creation one specifies how much is minted).
2. Ability to Burn/Issue Tokens. (only by the owner of the Contract)

There is a set of tests written for the Gambit.sol using the Truffle framework to do so.

Standards allows other contract developers to easily incorporate your token into their application.

## Interaction

The Contract is deployed in `0xdf0b7310588741cad931de88bc6c4f687cdf0e16` on the Ethereum Classic Network.

The friendliest way to interact with it is to go to https://classicetherwallet.com/#contracts and there, on **Contract Address** input, paste `0xdf0b7310588741cad931de88bc6c4f687cdf0e16`, and on the **ABI / JSON Interface** textarea paste the contents of  [contracts/Gambit.abi.json](/contracts/Gambit.abi.json).

Clicking on the **Access** will display the available functions on a select box. Most functions are described on the [ERC20](https://github.com/ethereum/EIPs/issues/20) description plus a few where added as a requirement.

  - **name** will always respond 'Gambit'
  - **decimals** will always respond 8
  - **symbol** will always respond 'GAM'
  - **version** will always respond '1.0.0'
  - **owner** will respond with the address that currently holds the Contract.
  - **changeOwnership** makes possible to transfer the ownership to another address.
    - Use with caution since if it's given to another contract that doesn't know how to interact with Gambit, ownership will be lost forever.
    - Only executable by the owner.
  - **burn** will eliminate Tokens from the total supply
    - Only executable by the owner.
    - Will only burn tokens held by the owner.
    - Tokens burnt are not recoverable.
  - **totalBurnt** the amount of tokens burnt by the owner.

## Develoment Environment

The project is built using [Truffle 3.2.4](http://truffleframework.com) and, to make sure that everybody involved runs tests and compiles using the same packages, we rely on [yarn](https://yarnpkg.com/en/) to handle the packages.

```
yarn install
```

To have a clean a standard version of a blockchain environment we will be using [this](https://github.com/b9lab/truffle-vagrant-env) vagrant configuration to run a brand new Virtual Machine with all required libraries for developing in solidity.
Please install [Vagrant](https://www.vagrantup.com) and make sure is working before running the following code.

```
git clone git@github.com:b9lab/truffle-vagrant-env.git
cd truffle-vagrant-env
vagrant up
```

This will download the packages necessary for a the development of DAPPS, run the VM and forward the standard ports to it.

  - HTTP Server
    - 8000
  - Ethereum client standard port
    - 8545
  - IPFS
    - 4001
    - 5001
    - 8080

It will also link the folder `~/DAPPS` of your local machine to `/home/vagrant/DAPPS`. This way it can have multiple projects running against the same environment.

All of this configuration can be changed on the `Vagrantfile`

Once the VM is up and running we need to run an Ethereum Client on it.
For development and testing purposes we recommend to use `testrpc`.

```
vagrant ssh
testrpc
```

## Testing

The Project contains multiple test scenarios dedicated to check the proper behaviour of the code in normal and edge cases.

```
yarn test
```

The scenarios so far are simple enough to be written in Javascript using the Truffle testing API which provides all of the steps to prepare, publish and interact with contracts on the blockchain while leaving the assertions of the results to the node environment.

However there are some caveats to using this approach.

  - function overloading is not supported by javascript.
  - testing for numbers over 10^15 since Javascript's big number library only ensures consistency till then.

## Deployment

There are 2 suggested ways to deploy the Gambit contract to the Ethereum Classic Network.

  1. Using the truffle command.
  2. Using the Ethereum Classic Mist Wallet.

Since the Contract needs the constructor to be executed (with the initial amount of Tokens) upon deployment, other wallets are not suitable.

### Truffle

The truffle framework provides a command to deploy contracts.

```
yarn deploy
```

This command by itself will attempt to log into an Ethereum-compatible node running on http://127.0.0.1:8545. It will attempt to deploy to any network available using the first address provided by the client (this command by itself is meant to be used during development against the testrpc client).

To run the proper deploy first we need to configure the `live` network in the `truffle.js` file. The available options are:

```
live: {
  network_id: 1, // Ethereum public network
  // from - default address to use for any transaction Truffle makes during migrations
  //
  // optional config values
  // host - defaults to "localhost"
  // port - defaults to 8545
  // gas
  // gasPrice
}
```

It's important to provide the `from` parameter since the Gambit Token will use that address as the owner of the Contract and the one address that would have all of the initial Tokens.

Once the network is configured, the initial amount of tokens needs to be provided in file `migrations/2_deploy_contracts.js`. Just replace the amount on line 4.

To proceed with the deploy the address must be unlocked for Truffle to run the migrations on the blockchain.

In this example we will be using [Ethereum Classic's go node](https://github.com/ethereumproject/go-ethereum/releases/tag/v3.4.0)

Run the node as a console and a http server.
```
geth --rpc console
```

If it's the first time running, it will sync and download the whole blockchain (make sure there is enough space in the hard drive).

Once the node is synced, lets proceed to unlock the address that will deploy the contract.

```
// In the Geth Console
web3.personal.unlockAccount("ADDRESS", "PASSWORD", 600);
// Must return true
```

This command will unlock the address for 10 minutes (enough time to deploy the contract).

Finally in another terminal run the deploy command.

```
yarn deploy --network live
```

Once deployed, Truffle will show the contract's address. It can also be found in the compiled file `build/contracts/Gambit.json`

> Truffle will deploy an initial `Migrations` contract to keep track of all the migrations run. This contract cost roughly 1/4 of the Gambit contract. This cost is only a 1 off and can be reused if the project grows and needs more contracts to be deployed.

### Ethereum Classic Mist Wallet

Open the [Ethereum Classic Mist Wallet](https://github.com/ethereumproject/mist/releases/tag/v0.9.1pre). This will run the included Geth Node in the background. Please wait until is fully synced.

On the contract tab click on `DEPLOY NEW CONTRACT`.

Make sure that the `SOLIDITY CONTRACT SOURCE CODE` is active.

> Since the Mist Wallet doesn't support `import` statements a Mist ready contract is provided in this project. `mist/Gambit.sol`

Copy the contents of `mist/Gambit.sol` into the textarea. The mist wallet will compile the contract and calculate an approximate amount of gas needed. It will also ask which Contract will be the one deployed, please choose `Gambit`.

Once Gambit is chosen, please provide the initial amount of Tokens to be created.

Finally, click the deploy button. This will ask for the address' password to sign and deploy the transaction.

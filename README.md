# Gambit

This repo contains Solidity smart contract code to issue simple, ERC20-compliant tokens on Ethereum.

The ERC20.sol contract is the interface for the standard proposed in issue [#20](https://github.com/ethereum/EIPs/issues/20).

The base is Token.sol which **ONLY** implements the core ERC20 standard functionality.

`Gambit.sol` is an implementation with all of the extra functionality of a token with optional extras, fit for issuing your own tokens to be mainly used by other humans. It includes:  

1. Initial Finite Supply (upon creation one specifies how much is minted).
2. Ability to Burn/Issue Tokens. (only by the owner of the Contract)

There is a set of tests written for `Gambit.sol` using the [Truffle](http://truffleframework.com/) framework.

Standards allows other contract developers to easily incorporate your token into their application.

## Interaction

The Contract address on the Ethereum Network is `0xF67451Dc8421F0e0afEB52faa8101034ed081Ed9`.

The friendliest way to interact with the contract is to go to https://www.myetherwallet.com/#contracts.

 - On the **Contract Address** text field paste `0xF67451Dc8421F0e0afEB52faa8101034ed081Ed9`, and on the **ABI / JSON Interface** textarea paste the contents of [contracts/Gambit.abi.json](/contracts/Gambit.abi.json).

- Clicking on the **Access** button will display the available functions on a select box. Most functions are described on the [ERC20](https://github.com/ethereum/EIPs/issues/20) description plus a few where added as a requirement.

  - **name** will always respond 'Gambit'
  - **approve** allows `_spender` to withdraw from your account, multiple times, up to the `_value` amount. If this function is called again it overwrites the current allowance with `_value`.
  - **allowance** Returns the amount which `_spender` is still allowed to withdraw from `_owner`
  - **totalSupply** will return the total amount of tokens
  - **transferFrom** will send `_value` amount of tokens from address `_from` to `_to` address
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
  - **balanceOf** Gets the account balance of another account with address `_owner`
  - **transfer** Send `_value` amount of tokens to address `_to`

    Refer to [contracts/ERC20.sol](/contracts/ERC20.json) for further info and documentation.

## Develoment Environment

The project is built using [Truffle 3.4.9](http://truffleframework.com).

To make sure that everybody involved runs tests and compiles using the same packages, we rely on [yarn](https://yarnpkg.com/en/) to handle the packages.

```
yarn install
```

To have a clean a standard version of a blockchain environment we use [this](https://github.com/b9lab/truffle-vagrant-env) vagrant configuration which runs a virtual machine with all the libraries needed for developing in solidity.

Install [Vagrant](https://www.vagrantup.com) and make sure is working before running the following code.

```
git clone git@github.com:b9lab/truffle-vagrant-env.git
cd truffle-vagrant-env
vagrant up
```

This will download the packages necessary for a the development of DAPPS, run the VM and forward the standard ports to it.

  - HTTP Server: `8000`
  - Ethereum client standard port: `8545`
  - IPFS: `4001`, `5001`, `8080`

It will also link the folder `~/DAPPS` of your local machine to `/home/vagrant/DAPPS`. This way is possible to have multiple projects running against the same environment.

All of this configuration can be changed on the `Vagrantfile` file.

Once the VM is up and running we need to run an Ethereum Client on it.
For development and testing purposes we recommend to use `testrpc`.

```
vagrant ssh
testrpc
```

## Testing

The Project contains multiple test scenarios dedicated to check the proper behavior of the code in normal and edge cases.

```
yarn test
```

The scenarios so far are simple enough to be written in Javascript using the Truffle testing API which provides all of the steps to prepare, publish and interact with contracts on the blockchain while leaving the assertions of the results to the node environment.

However there are some caveats to using this approach.

  - function overloading is not supported by javascript.
  - testing for numbers over 10^15 since Javascript's `bignumber` library only ensures consistency till then.

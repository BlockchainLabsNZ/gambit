# Gambit

This repo contains Solidity smart contract code to issue simple, ERC20-compliant tokens on Ethereum.

The ERC20.sol contract is the interface for the standard proposed in issue [#20](https://github.com/ethereum/EIPs/issues/20).  

The base is Token.sol which ONLY implements the core ERC20 standard functionality.

Gambit.sol is an implementation with all of the extra functionalityexample of a token that has optional extras fit for your issuing your own tokens, to be mainly used by other humans. It includes:  

1. Initial Finite Supply (upon creation one specifies how much is minted).
2. Ability to Burn/Issue Tokens. (only by the owner of the Contract)

There is a set of tests written for the Gambit.sol using the Truffle framework to do so.

Standards allows other contract developers to easily incorporate your token into their application.

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

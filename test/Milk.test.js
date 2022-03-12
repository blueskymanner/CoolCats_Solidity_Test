const { ethers } = require('hardhat');
const { expect, assert } = require('chai');
const Web3 = require('web3');
const web3 = new Web3(Web3.givenProvider || 'ws://remotenode.com:8546');


describe('Milk', function() {
    let owner, secondAddress;

    before(async function() {
        this.Milk = await ethers.getContractFactory('Milk');
    });

    beforeEach(async function() {
        this.milk = await (await this.Milk.deploy("MilkToken", "MILK")).deployed();
        [owner, secondAddress] = await ethers.getSigners();

        const depositor_role = await this.milk.DEPOSITOR_ROLE();
        await this.milk.grantRole(depositor_role, owner.address);
        const has_role1 = await this.milk.hasRole(depositor_role, owner.address);

        const contract_role = await this.milk.CONTRACT_ROLE();
        await this.milk.grantRole(contract_role, owner.address);
        const has_role2 = await this.milk.hasRole(contract_role, owner.address);

        const master_role = await this.milk.MASTER_ROLE();
        await this.milk.grantRole(master_role, owner.address);
        const has_role3 = await this.milk.hasRole(master_role, owner.address);

        expect(depositor_role).to.equal('0x8f4f2da22e8ac8f11e15f9fc141cddbb5deea8800186560abb6e68c5496619a9');
        expect(has_role1).to.equal(true);

        expect(contract_role).to.equal('0x364d3d7565c7a8300c96fd53e065d19b65848d7b23b3191adcd55621c744223c');
        expect(has_role2).to.equal(true);

        expect(master_role).to.equal('0x8b8c0776df2c2176edf6f82391c35ea4891146d7a976ee36fd07f1a6fb4ead4c');
        expect(has_role3).to.equal(true);
    });

    it('Milk deploys successfully', async function() {
        const address = this.milk.address;
        assert.notEqual(address, "");
        assert.notEqual(address, 0x0);
        assert.notEqual(address, undefined);
        assert.notEqual(address, null);

        console.log(address);
    });

    it('It has a name', async function() {
        const name = await this.milk.name();
        expect(name).to.equal('MilkToken');
    });

    it('It has a symbol', async function() {
        const symbol = await this.milk.symbol();
        expect(symbol).to.equal('MILK');
    });

    it('deposit and withdraw testing', async function() {
        const hash = web3.eth.abi.encodeParameter('uint256', 77);

        await this.milk.deposit(owner.address, hash);
        const balance1 = await this.milk.balanceOf(owner.address);
        const total_supply1 = await this.milk.totalSupply();

        console.log(balance1);
        console.log(total_supply1);

        await this.milk.withdraw(7);
        const balance2 = await this.milk.balanceOf(owner.address);
        const total_supply2 = await this.milk.totalSupply();

        console.log(balance2);
        console.log(total_supply2);

        await this.milk.gameWithdraw(owner.address, 17);
        const balance3 = await this.milk.balanceOf(owner.address);
        const total_supply3 = await this.milk.totalSupply();

        console.log(balance3);
        console.log(total_supply3);

        await this.milk.gameTransferFrom(owner.address, secondAddress.address, 15);
        const owner_balance1 = await this.milk.balanceOf(owner.address);
        const secondAddress_balance1 = await this.milk.balanceOf(secondAddress.address);

        console.log(owner_balance1);
        console.log(secondAddress_balance1);

        await this.milk.gameBurn(owner.address, 19);
        const owner_balance2 = await this.milk.balanceOf(owner.address);
        const contract_balance2 = await this.milk.balanceOf(this.milk.address);
        const total_supply4 = await this.milk.totalSupply();

        console.log(owner_balance2);
        console.log(contract_balance2);
        console.log(total_supply4);
    });

    it('gameMint', async function() {
        await this.milk.gameMint(secondAddress.address, 33);
        const balance = await this.milk.balanceOf(secondAddress.address);
        const total_supply = await this.milk.totalSupply();

        console.log(balance);
        console.log(total_supply);
    });

    it('mint', async function() {
        await this.milk.mint(owner.address, 29);
        const balance = await this.milk.balanceOf(owner.address);
        const total_supply = await this.milk.totalSupply();

        console.log(balance);
        console.log(total_supply);
    });
});

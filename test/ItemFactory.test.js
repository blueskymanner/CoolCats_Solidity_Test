const { ethers } = require('hardhat');
const { expect, assert } = require('chai');
const Web3 = require('web3');
const web3 = new Web3(Web3.givenProvider || 'ws://remotenode.com:8546');


describe('ItemFactory', function() {
    let owner, secondAddress;

    before(async function() {
        this.Milk = await ethers.getContractFactory('Milk');
        this.ItemFactory = await ethers.getContractFactory('ItemFactory');
    });

    beforeEach(async function() {
        this.milk = await (await this.Milk.deploy("MilkToken", "MILK")).deployed();
        this.itemFactory = await (await this.ItemFactory.deploy("https://ipfs/R2GOR7LB", this.milk.address)).deployed();
        [owner, secondAddress] = await ethers.getSigners();

        const admin_role = await this.itemFactory.ADMIN_ROLE();
        await this.itemFactory.grantRole(admin_role, owner.address);
        const has_role1 = await this.itemFactory.hasRole(admin_role, owner.address);

        expect(admin_role).to.equal('0xa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c21775');
        expect(has_role1).to.equal(true);

        const contract_role = await this.milk.CONTRACT_ROLE();
        await this.milk.grantRole(contract_role, this.itemFactory.address);
        const has_role2 = await this.milk.hasRole(contract_role, this.itemFactory.address);
        
        expect(contract_role).to.equal('0x364d3d7565c7a8300c96fd53e065d19b65848d7b23b3191adcd55621c744223c');
        expect(has_role2).to.equal(true);
    });

    it('ItemFactory deploys successfully', async function() {
        const milk_address = this.milk.address;
        const itemFactory_address = this.itemFactory.address;

        assert.notEqual(itemFactory_address, "");
        assert.notEqual(itemFactory_address, 0x0);
        assert.notEqual(itemFactory_address, undefined);
        assert.notEqual(itemFactory_address, null);
        assert.notEqual(milk_address, itemFactory_address);

        console.log(milk_address);
        console.log(itemFactory_address);

        const milkContractAddress = await this.itemFactory._milkContractAddress();

        const commonRoll = await this.itemFactory._commonRoll();
        const uncommonRoll = await this.itemFactory._uncommonRoll();
        const rareRoll = await this.itemFactory._rareRoll();
        const epicRoll = await this.itemFactory._epicRoll();
        const legendaryRoll = await this.itemFactory._legendaryRoll();

        expect(milk_address).to.equal(milkContractAddress);

        expect(commonRoll).to.equal(60);
        expect(uncommonRoll).to.equal(80);
        expect(rareRoll).to.equal(90);
        expect(epicRoll).to.equal(98);
        expect(legendaryRoll).to.equal(100);
    });

    it('setReward testing.', async function() {
        const hash1 = web3.eth.abi.encodeParameters(['uint256', 'uint256', 'uint256[]'], [1, 10, [111, 222]]);
        const hash2 = web3.eth.abi.encodeParameters(['uint256', 'uint256', 'uint256[]'], [1, 20, [222, 333]]);
        const hash3 = web3.eth.abi.encodeParameters(['uint256', 'uint256', 'uint256[]'], [1, 30, [333, 444]]);
        const hash4 = web3.eth.abi.encodeParameters(['uint256', 'uint256', 'uint256[]'], [1, 40, [444, 555]]);
        const hash5 = web3.eth.abi.encodeParameters(['uint256', 'uint256', 'uint256[]'], [1, 50, [555, 666]]);

        await this.itemFactory.setReward(0, 0, hash1);
        await this.itemFactory.setReward(0, 1, hash2);
        await this.itemFactory.setReward(0, 2, hash3);
        await this.itemFactory.setReward(0, 3, hash4);
        await this.itemFactory.setReward(0, 4, hash5);

        console.log(hash1);
        console.log(hash2);
        console.log(hash3);
        console.log(hash4);
        console.log(hash5);

        await this.itemFactory.claim(owner.address, 123, 1);
        
        const lastUpdate = await this.itemFactory._lastUpdate(1);
        console.log(lastUpdate);
    });

    it('setRarityRolls testing.', async function() {
        await this.itemFactory.setRarityRolls(50, 70, 80, 88, 90);

        const commonRoll = await this.itemFactory._commonRoll();
        const uncommonRoll = await this.itemFactory._uncommonRoll();
        const rareRoll = await this.itemFactory._rareRoll();
        const epicRoll = await this.itemFactory._epicRoll();
        const legendaryRoll = await this.itemFactory._legendaryRoll();

        expect(commonRoll).to.equal(50);
        expect(uncommonRoll).to.equal(70);
        expect(rareRoll).to.equal(80);
        expect(epicRoll).to.equal(88);
        expect(legendaryRoll).to.equal(90);
    });
});

const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SkillRegistry", function () {
  let skillRegistry, oracle, owner, creator, buyer;

  beforeEach(async function () {
    [owner, creator, buyer] = await ethers.getSigners();

    const MockOracle = await ethers.getContractFactory("MockOracle");
    oracle = await MockOracle.deploy();

    const SkillRegistry = await ethers.getContractFactory("SkillRegistry");
    skillRegistry = await SkillRegistry.deploy(await oracle.getAddress());
  });

  describe("Skill Creation", function () {
    it("should create a skill and mint INFT", async function () {
      const tx = await skillRegistry.connect(creator).createSkill(
        "Sentiment Analysis",
        "Analyzes text sentiment",
        "0g://encrypted-skill-weights",
        ethers.keccak256(ethers.toUtf8Bytes("skill-meta")),
        ethers.parseEther("0.001"), // price per use
        ethers.parseEther("0.1")   // subscription price
      );
      await tx.wait();

      expect(await skillRegistry.ownerOf(1)).to.equal(creator.address);

      const skill = await skillRegistry.getSkill(1);
      expect(skill.name).to.equal("Sentiment Analysis");
      expect(skill.active).to.be.true;
      expect(skill.creator).to.equal(creator.address);
    });
  });

  describe("Pay Per Use", function () {
    beforeEach(async function () {
      await skillRegistry.connect(creator).createSkill(
        "Test Skill", "desc", "uri",
        ethers.keccak256(ethers.toUtf8Bytes("meta")),
        ethers.parseEther("0.001"),
        ethers.parseEther("0.1")
      );
    });

    it("should accept payment and authorize user", async function () {
      const creatorBalBefore = await ethers.provider.getBalance(creator.address);

      await skillRegistry.connect(buyer).payForUse(1, {
        value: ethers.parseEther("0.001"),
      });

      const skill = await skillRegistry.getSkill(1);
      expect(skill.totalUses).to.equal(1n);

      const isAuth = await skillRegistry.isAuthorizedUser(1, buyer.address);
      expect(isAuth).to.be.true;
    });

    it("should reject insufficient payment", async function () {
      await expect(
        skillRegistry.connect(buyer).payForUse(1, {
          value: ethers.parseEther("0.0001"),
        })
      ).to.be.revertedWith("Insufficient payment");
    });
  });

  describe("Subscription", function () {
    beforeEach(async function () {
      await skillRegistry.connect(creator).createSkill(
        "Test Skill", "desc", "uri",
        ethers.keccak256(ethers.toUtf8Bytes("meta")),
        ethers.parseEther("0.001"),
        ethers.parseEther("0.1")
      );
    });

    it("should create subscription", async function () {
      await skillRegistry.connect(buyer).subscribe(1, {
        value: ethers.parseEther("0.1"),
      });

      const sub = await skillRegistry.subscriptions(1, buyer.address);
      expect(sub.expiresAt).to.be.gt(0);

      const isAuth = await skillRegistry.isAuthorizedUser(1, buyer.address);
      expect(isAuth).to.be.true;
    });
  });

  describe("Skill Management", function () {
    it("should deactivate skill", async function () {
      await skillRegistry.connect(creator).createSkill(
        "Test", "desc", "uri",
        ethers.keccak256(ethers.toUtf8Bytes("meta")),
        ethers.parseEther("0.001"),
        ethers.parseEther("0.1")
      );

      await skillRegistry.connect(creator).deactivateSkill(1);
      const skill = await skillRegistry.getSkill(1);
      expect(skill.active).to.be.false;
    });

    it("should update pricing", async function () {
      await skillRegistry.connect(creator).createSkill(
        "Test", "desc", "uri",
        ethers.keccak256(ethers.toUtf8Bytes("meta")),
        ethers.parseEther("0.001"),
        ethers.parseEther("0.1")
      );

      await skillRegistry.connect(creator).updatePricing(
        1,
        ethers.parseEther("0.005"),
        ethers.parseEther("0.5")
      );

      const skill = await skillRegistry.getSkill(1);
      expect(skill.pricePerUse).to.equal(ethers.parseEther("0.005"));
    });
  });
});

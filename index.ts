import {
    Aptos,
    AptosConfig,
    Network,
    Account,
    Ed25519PrivateKey,
  } from "@aptos-labs/ts-sdk";
  
  async function main() {
    const config = new AptosConfig({ network: Network.TESTNET });
    const aptos = new Aptos(config);
  
    const PRIVATE_KEY = new Ed25519PrivateKey("ed25519-priv-0x9d96b1e3d4b57bffe43f2ff432d63005400a733853abcf50bf9a8bffb76ca169");
  
    const MY_ACCOUNT = Account.fromPrivateKey({
      privateKey: PRIVATE_KEY,
    });
  
    const myBalance = await aptos.getAccountAPTAmount({
      accountAddress: MY_ACCOUNT.accountAddress,
    });
  
    console.log("Balance:", myBalance);
  
    const transaction = await aptos.transaction.build.simple({
      sender: MY_ACCOUNT.accountAddress,
      data: {
        function:
          "0x777b93e13ff2a1bc872eb4d099ae15a52fb70f2f01dd18d7c809e217fb0e543e::tba_exam::add_participant",
        functionArguments: [
          "0x539f880b3da2bc33d98b5efbf611eb76b6a980b0fdb15badb537767e0767d6e3",
          "Christian Seguerra",                         // full_name
          "https://github.com/ChrisSeguerra",       // GitHub
          "cdseguerra2919@gmail.com",                      // email
          "makunatgaming#0000",                       // Discord
        ],
      },
    });
  
    const senderAuthenticator = aptos.transaction.sign({
      signer: MY_ACCOUNT,
      transaction,
    });
  
    const pendingTransaction = await aptos.transaction.submit.simple({
      transaction,
      senderAuthenticator,
    });
  
    const txnResult = await aptos.waitForTransaction({
      transactionHash: pendingTransaction.hash,
    });
  
    console.log(
      `Transaction completed with status: ${
        txnResult.success ? "SUCCESS" : "FAILURE"
      }`
    );
  }
  
  main().catch(console.error);
  
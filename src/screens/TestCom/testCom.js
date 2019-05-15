import React from 'react';
import {Text, Button, View} from '@src/components/core';
import { initWallet, loadWallet } from '@src/services/wallet/WalletService';
import Account  from '@src/services/wallet/accountService';
import Server from '@src/services/wallet/Server';
import Token  from '@src/services/wallet/tokenService';

import {setRpcClient, getEstimateFee, getEstimateFeeForSendingToken, getEstimateFeeToDefragment} from '@src/services/wallet/RpcClientService';
import { getPassphrase } from '@src/services/wallet/passwordService';

class Kraken extends React.Component {
  constructor(){
    super();

    this.state = {
      wallet: null
    };

    // this.handleReloadWallet = this.handleReloadWallet.bind(this);
  }

  componentDidMount = async () => {
    // init wallet
    const wallet =  await initWallet();
    console.log('Wallet: ', wallet);
    this.setState({wallet});

    // set rpcClient for Wallet
    const server = Server.getDefault();
    setRpcClient(server.address, server.username, server.password);

    // setTimeout(() => console.log('Wallet rpcclient: ', Wallet.RpcClient), 2000);
    this.setState({wallet});

    await this.handleImportAccount();
    await this.handleImportAccount2();
  }

  handleReloadWallet = async() =>{
    const wallet = await loadWallet();
    this.setState({wallet});
    console.log('Wallet after reloading: ', wallet);
  }

  handleImportAccount = async () => {
    const privateKey = '112t8rnYG3kGkuxLeXQUWH3KdQACvCSBEfKxiujwdd31EtCYH2nJfYj3zPRBoAiSPFuhwGnCqCQxcJm5U8XMFqXLtuLy7StCZWpmjorFe7h7';
    const accountName = 'hn1';
    const passPhrase = await getPassphrase();
    const wallet = this.state.wallet;
    let  res;
    try{
      res = await Account.importAccount(privateKey, accountName, passPhrase, wallet);
      this.setState({wallet});
      console.log('res import account hn1: ', res);
    } catch(e){
      console.log('Error when import account: ', e);
      throw e;
    }

    return res;
  
  }

  handleImportAccount2 = async () => {
    const privateKey = '112t8rnXSt9kxK7RwGT7QM8Uj9mnSimS4gF2fVK4uZ2dvtnm5Ku1CRX5ruRCAT7iYjL8Pt2yb9PJyYQvDqGVUH5HMqiaSQZWcrRM5ZqYyDKP';
    const accountName = 'hn2';
    const passPhrase = await getPassphrase();
    const wallet = this.state.wallet;
    let  res;
    try{
      res = await Account.importAccount(privateKey, accountName, passPhrase, wallet);
      this.setState({wallet});
      console.log('res import account hn2: ', res);
    } catch(e){
      console.log('Error when import account: ', e);
      throw e;
    }

    return res;
  
  }

  // estimateFeeForConstant = async() => {
  //   const fee = await getEstimateFee(from, to, amount, privateKey, accountWallet, isPrivacy);
  //   return fee;

  // }

  handleSendConsant = async() => {
    // hn2
    const amount = Number(100);
    const toAddress = '1Uv2n3fom66uGuSdMUcicT4GqfZkkCmWF2YvkLCjcj8yiKmnLh4SC1qz2NoFN7TEtyHUqwRADvLAey8gEzPg71EMXcWsMjKyWdBCPmiQy';
    const param = [{ paymentAddressStr: toAddress, amount}];
    // const fee = Number(50);  // miliconstant
    const isPrivacy = true;
    const account = {name: 'hn1'};
    const wallet = this.state.wallet;

    //estimate fee
    const fromAddress = '1Uv3WSbaVLgpUn3zYFtJeYpPVRx6dHAeGCX4gUfh6Qa2Zw9gj9SAv4eyyfQFSmfByLs9k3EYxhTPZjjTfZ4v23xKUrNJvMx5VuHF2iFhQ';
    const privateKey = '112t8rnYG3kGkuxLeXQUWH3KdQACvCSBEfKxiujwdd31EtCYH2nJfYj3zPRBoAiSPFuhwGnCqCQxcJm5U8XMFqXLtuLy7StCZWpmjorFe7h7';
    const indexAccount = wallet.getAccountIndexByName(account.name);
    const accountWallet = wallet.MasterAccount.child[indexAccount];

    const fee = await getEstimateFee(fromAddress, toAddress, amount, privateKey, accountWallet, isPrivacy);

    console.log('Fee estimate: ', fee);
    try{
      const res = await Account.sendConstant(param, fee, isPrivacy, account, wallet);
      console.log('Res sending constant: ', res);
    } catch(e){
      console.log('Error when sending constant: ', e );
    }
  }

  handleDefragment = async() => {
    const amount =  Number(10000); 
    const isPrivacy = true;
    const account = {name: 'hn2'};
    const wallet = this.state.wallet;

    //estimate fee
    const fromAddress = '1Uv2n3fom66uGuSdMUcicT4GqfZkkCmWF2YvkLCjcj8yiKmnLh4SC1qz2NoFN7TEtyHUqwRADvLAey8gEzPg71EMXcWsMjKyWdBCPmiQy';
    const privateKey = '112t8rnXSt9kxK7RwGT7QM8Uj9mnSimS4gF2fVK4uZ2dvtnm5Ku1CRX5ruRCAT7iYjL8Pt2yb9PJyYQvDqGVUH5HMqiaSQZWcrRM5ZqYyDKP';
    const indexAccount = wallet.getAccountIndexByName(account.name);
    const accountWallet = wallet.MasterAccount.child[indexAccount];

    const fee = await getEstimateFeeToDefragment(fromAddress, amount, privateKey, accountWallet, isPrivacy);

    console.log('Fee estimate: ', fee);
    try{
      const res = await Account.defragment(amount, fee, isPrivacy, account, wallet);
      console.log('Res defragment: ', res);
    } catch(e){
      console.log('Error when defragment: ', e );
    }
  }

  handleCreateAccount = async() => {
    const accountName = 'rose';
    const wallet = this.state.wallet;
    try{
      const res = await Account.createAccount(accountName, wallet);
      console.log('Res createAccount: ', res);
      console.log('Wallet after create new account: ', wallet.MasterAccount.child);
    } catch(e){
      console.log('Error when createAccount: ', e );
    }
  }

  handleCreateToken = async() => {
    const account = {name: 'hn1'};
    const wallet = this.state.wallet;

    //estimate fee
    //hn1
    const fromAddress = '1Uv3WSbaVLgpUn3zYFtJeYpPVRx6dHAeGCX4gUfh6Qa2Zw9gj9SAv4eyyfQFSmfByLs9k3EYxhTPZjjTfZ4v23xKUrNJvMx5VuHF2iFhQ';
    const privateKey = '112t8rnYG3kGkuxLeXQUWH3KdQACvCSBEfKxiujwdd31EtCYH2nJfYj3zPRBoAiSPFuhwGnCqCQxcJm5U8XMFqXLtuLy7StCZWpmjorFe7h7';
    const indexAccount = wallet.getAccountIndexByName(account.name);
    const accountWallet = wallet.MasterAccount.child[indexAccount];

    const amount = 10000;

    const tokenObject = {
      Privacy : false,
      TokenID:  '',
      TokenName: 'token10',
      TokenSymbol: 'token10',
      TokenTxType: 0,
      TokenAmount: amount,
      TokenReceivers: {
        PaymentAddress: fromAddress,
        Amount: amount
      }
    };

    const fee = await getEstimateFeeForSendingToken(fromAddress, fromAddress, amount, tokenObject, privateKey, accountWallet);

    console.log('Fee estimate: ', fee);

    try{
      const res = await Token.createSendCustomToken(tokenObject, fee, account, wallet);
      console.log('Res create token: ', res);
    } catch(e){
      console.log('Error when create token: ', e );
    }
  }

  handleSendToken = async() => {
    const account = {name: 'hn1'};
    const wallet = this.state.wallet;

    //estimate fee
    //hn1
    const fromAddress = '1Uv3WSbaVLgpUn3zYFtJeYpPVRx6dHAeGCX4gUfh6Qa2Zw9gj9SAv4eyyfQFSmfByLs9k3EYxhTPZjjTfZ4v23xKUrNJvMx5VuHF2iFhQ';
    const privateKey = '112t8rnYG3kGkuxLeXQUWH3KdQACvCSBEfKxiujwdd31EtCYH2nJfYj3zPRBoAiSPFuhwGnCqCQxcJm5U8XMFqXLtuLy7StCZWpmjorFe7h7';
    const indexAccount = wallet.getAccountIndexByName(account.name);
    const accountWallet = wallet.MasterAccount.child[indexAccount];

    // hn2
    const toAddress = '1Uv2n3fom66uGuSdMUcicT4GqfZkkCmWF2YvkLCjcj8yiKmnLh4SC1qz2NoFN7TEtyHUqwRADvLAey8gEzPg71EMXcWsMjKyWdBCPmiQy';
    const amount = 10;

    const tokenObject = {
      Privacy : false,
      TokenID:  '6d1de0a09da6942429b1565bc971d585a20800e2e8fd1589bfebda5858c105f2',
      TokenName: 'token10',
      TokenSymbol: 'token10',
      TokenTxType: 1,
      TokenAmount: 10000,
      TokenReceivers: {
        PaymentAddress: toAddress,
        Amount: amount
      }
    };

    const fee = await getEstimateFeeForSendingToken(fromAddress, toAddress, amount, tokenObject, privateKey, accountWallet);

    console.log('Fee estimate: ', fee);

    try{
      const res = await Token.createSendCustomToken(tokenObject, fee, account, wallet);
      console.log('Res sending token: ', res);
    } catch(e){
      console.log('Error when sending token: ', e );
    }
  }

  handleCreatePrivacyToken = async() => {
    const account = {name: 'hn1'};
    const wallet = this.state.wallet;

    //estimate fee
    //hn1
    const fromAddress = '1Uv3WSbaVLgpUn3zYFtJeYpPVRx6dHAeGCX4gUfh6Qa2Zw9gj9SAv4eyyfQFSmfByLs9k3EYxhTPZjjTfZ4v23xKUrNJvMx5VuHF2iFhQ';
    const privateKey = '112t8rnYG3kGkuxLeXQUWH3KdQACvCSBEfKxiujwdd31EtCYH2nJfYj3zPRBoAiSPFuhwGnCqCQxcJm5U8XMFqXLtuLy7StCZWpmjorFe7h7';
    const indexAccount = wallet.getAccountIndexByName(account.name);
    const accountWallet = wallet.MasterAccount.child[indexAccount];

    const amount = 10000;

    const tokenObject = {
      Privacy : true,
      TokenID:  '',
      TokenName: 'tp10',
      TokenSymbol: 'tp10',
      TokenTxType: 0,
      TokenAmount: amount,
      TokenReceivers: {
        PaymentAddress: fromAddress,
        Amount: amount
      }
    };

    const fee = await getEstimateFeeForSendingToken(fromAddress, fromAddress, amount, tokenObject, privateKey, accountWallet);

    console.log('Fee estimate: ', fee);

    try{
      const res = await Token.createSendPrivacyCustomToken(tokenObject, fee, account, wallet);
      console.log('Res create token: ', res);
    } catch(e){
      console.log('Error when create token: ', e );
    }
  }

  handleSendPrivacyToken = async() => {
    const account = {name: 'hn1'};
    const wallet = this.state.wallet;

    //estimate fee
    //hn1
    const fromAddress = '1Uv3WSbaVLgpUn3zYFtJeYpPVRx6dHAeGCX4gUfh6Qa2Zw9gj9SAv4eyyfQFSmfByLs9k3EYxhTPZjjTfZ4v23xKUrNJvMx5VuHF2iFhQ';
    const privateKey = '112t8rnYG3kGkuxLeXQUWH3KdQACvCSBEfKxiujwdd31EtCYH2nJfYj3zPRBoAiSPFuhwGnCqCQxcJm5U8XMFqXLtuLy7StCZWpmjorFe7h7';
    const indexAccount = wallet.getAccountIndexByName(account.name);
    const accountWallet = wallet.MasterAccount.child[indexAccount];

    // hn2
    const toAddress = '1Uv2n3fom66uGuSdMUcicT4GqfZkkCmWF2YvkLCjcj8yiKmnLh4SC1qz2NoFN7TEtyHUqwRADvLAey8gEzPg71EMXcWsMjKyWdBCPmiQy';
    const amount = 10;

    const tokenObject = {
      Privacy : true,
      TokenID:  '8858208ae02223fd23bc9a02ff9170073335e98320e6586a3ff7b5518d96c256',
      TokenName: 'tp10',
      TokenSymbol: 'tp10',
      TokenTxType: 1,
      TokenAmount: 10000,
      TokenReceivers: {
        PaymentAddress: toAddress,
        Amount: amount
      }
    };

    const fee = await getEstimateFeeForSendingToken(fromAddress, toAddress, amount, tokenObject, privateKey, accountWallet);

    console.log('Fee estimate: ', fee);

    try{
      const res = await Token.createSendPrivacyCustomToken(tokenObject, fee, account, wallet);
      console.log('Res sending token: ', res);
    } catch(e){
      console.log('Error when sending token: ', e );
    }
  }

  

  render() {
    const { wallet } = this.state;
    console.log('Wallet: ', wallet);
    return (
      <View>
        <Text>{wallet?.Name || 'Rose'}</Text>
        <Button title='Reload Wallet' onPress={this.handleReloadWallet} />
        <Button title='Send constant' onPress={this.handleSendConsant} />
        <Button title='Defragment' onPress={this.handleDefragment} />
        <Button title='Create new account' onPress={this.handleCreateAccount} />

        <Button title='Create new token' onPress={this.handleCreateToken} />
        <Button title='Send token' onPress={this.handleSendToken} />

        <Button title='Create new privacy token' onPress={this.handleCreatePrivacyToken} />
        <Button title='Send privacy token' onPress={this.handleSendPrivacyToken} />
      </View>
    );
  }
}

export default Kraken;
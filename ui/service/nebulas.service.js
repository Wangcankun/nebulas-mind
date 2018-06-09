angular.module('kityminderEditor')
.service('nebulasService',  function() {
  this.config = {
    wallet:{
        address:'',
        balance:-1,
        type:87,
        plugInExist:false
    },
    contract:{
        TestnetUrl:"https://testnet.nebulas.io",
        MainnetUrl:"https://mainnet.nebulas.io",
        TestAddress:"",
        MainAddress:""
    }
  };

  var nebulas = require('nebulas');
  var Account = nebulas.Account;
  var Neb = new nebulas.Neb();
  Neb.setRequest(new nebulas.HttpRequest(this.config.contract.MainnetUrl));
  var NebPay = require('nebpay');
  var nebPay = new NebPay();
  this.options = {
    callback:NebPay.config.mainnetUrl
   }
  var _g = {};

  this.checkwallet = function(){
    if (this.config.wallet.address && this.config.wallet.address.length === 35) {
        console.log('prepare for mobile wallet');
        return true;
      } else if (!this.config.wallet.plugInExist || !this.config.wallet.address || this.config.wallet.address.length !== 35) {
        alert('钱包地址获取失败');
        return false;
      } else {
        console.log('emmm');
        return false;
      }
  }

  this.get = function(title,callback){
    var from = this.config.wallet.address;
    var value = "0";
    var nonce = "0";
    var gas_price = "1000000";
    var gas_limit = "2000000";
    var callFunction = "get";
    var callArgsObj = [];
    callArgsObj.push(title+this.config.wallet.address);
    var callArgs = JSON.stringify(callArgsObj);

    var contract = {
        "function":callFunction,
        "args":callArgs
    }

    console.log("from:",from);

    Neb.api.call(from,this.config.contract.MainAddress,value,nonce,gas_price,gas_limit,contract).then(function(resp){
        var result = resp.result;
        if(result != null){
            console.log(JSON.parse(result));
            callback(JSON.parse(result));
        }
        
    })
  }

  this.save =function(rootdata){
    
    var listenCount = 0;
    var hashCount   = 0;
    var intervalQuery;
    var seriaNumber;
    
				
	var to = this.config.contract.MainAddress;
	var value = "0";
	var callFunction = "save";
	var callArgsObj = [];
					
	callArgsObj.push(rootdata.root.data.text+this.config.wallet.address);
	callArgsObj.push(JSON.stringify(rootdata));
	var callArgs = JSON.stringify(callArgsObj);
	console.log(callArgs);
					
            seriaNumber = nebPay.call(to,value,callFunction,callArgs,this.options);
            console.log("seriaNumber",seriaNumber);
            _g.intervalQuery = setInterval(function() {
                funcIntervalQuery(seriaNumber);
            }, 10000);
  }

  function funcIntervalQuery(number){
    nebPay.queryPayInfo(number, this.options)   //search transaction result from server (result upload to server by app)
    .then(function (resp) {
        
        var respObject = JSON.parse(resp)
        //code==0交易发送成功, status==1交易已被打包上链
        if(respObject.code === 0 && respObject.data.status === 1){                    
            //交易成功,处理后续任务....
            alert("文件保存成功!");
            clearInterval(_g.intervalQuery);    //清除定时查询
        }
    })
    .catch(function (err) {
        console.log(err);
        clearInterval(_g.intervalQuery);
    });
  }

  this.getConfig = function(){
      return this.config;
  }

  this.setConfig = function(config){
      this.config = config;
  }

});
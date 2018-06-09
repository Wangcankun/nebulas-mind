define(function(require, exports, module) {
    function TheMindRuntime (){
        var SmartMind = function(data){
            if(data){
                var obj = JSON.parse(data);
                this.title = obj.title;
                this.layout = obj.layout;
                this.minddata = obj.minddata;
                this.author = obj.author
            }
        };

        SmartMind.prototype = {
            toString: function(){
                return JSON.stringify(this)
            }
        };

        var TheMind = function(){
            LocalContractStorage.defineMapProperty(this,"data",{
                parse:function(data){
                    return new SmartMind(data);
                },
                stringify:function(o){
                    return o.toString();
                }
            });
        }

        TheMind.prototype = {
            init:function(){

            },
            save:function(title,minddata){
                if(!title || !minddata){
                    throw new Error("empty title or minddata")
                }
                var mindObj = JSON.parse(minddata);
                var from = Blockchain.transaction.form;
                var smartMind = new SmartMind();
                smartMind.author = from;
                smartMind.title = title;
                smartMind.minddata = minddata;
                smartMind.layout = mindObj.theme;
                this.data.put(title,smartMind);
            },
            get:function(title){
                if(!title){
                    throw new Error("empty title")
                }
                return this.data.get(title);
            }

        }
}
return module.exports = TheMindRuntime;

});
import { APIHelper } from "services"
import * as signalR from '@aspnet/signalr';
var realtimeUrl = window.realtimeUrl;
class SignalRReatime {
    constructor() {
        this.proxy = {};
        this.state = "connecting";
        this.refID = 1;
        this.ref = [];
        APIHelper.get("FB/GetShopInfo").then(data => {
            console.log("connecting room ", data.RealTimeRoom)
            this.room= data.RealTimeRoom;
            this.start(data.RealTimeRoom);
        })
    }

    notifyLocal(target, data){
        var targets = target.split(',');
        targets.forEach(target => {
            this.ref.forEach(ref => {
                if (ref.path == target) {
                    try {
                        ref.action(data);
                    } catch{

                    }

                }
            });
        });
    }

    start(room) {
        try {
            let connection = new signalR.HubConnectionBuilder()
                .withUrl(realtimeUrl)
                //.configureLogging(signalR.LogLevel.Trace)

                .build();

            connection.on("onMessage", data => {
                //console.log("onMessage", data);
                var targets = data.target.split(',');
                targets.forEach(target => {
                    this.ref.forEach(ref => {
                        if (ref.path == target) {
                            try {
                                ref.action(JSON.parse(data.data));
                            } catch{

                            }

                        }
                    });
                });


            });

            connection.start()
                .then(() => {
                    connection.invoke("join", room)
                    console.log("realtime connected")
                }).catch(err => {
                    console.log("realtime error", err)
                });

        }
        catch (err) {
            console.log("loi roi", err);

        }

    }

    subscribe(path, action) {
        this.refID++;
        var obj = {
            id: this.refID,
            path: path,
            action: action
        }
        this.ref.push(obj);
        return this.refID;
    }
    unSubscribe(id) {
        var index = this.ref.findIndex(item => {
            return item.id == id;
        })
        if (index >= 0) {
            this.ref.splice(index, 1);
        }
    }


    getHub(hubname, callBack) {
        return this.proxy[hubname];
        // //;
        // // var hub = window.RealTimeConnection[hubname];
        // // this.client = hub.client;
        // // this.server = hub.server;
        // // var connection = $.hubConnection("http://localhost:8089/signalr", { useDefaultPath: false });
        // // var proxy = connection.createHubProxy("fbChatHub");
        // // proxy.invoke("test", "abc");

        // // //this.server.test("abc");
        // // alert("sssss");
        // //return hub;
        // this.proxy.fbChatHub.off('test');
        // this.proxy.fbChatHub.on('test', function (userName) {
        //     console.log(userName);
        // });
        // setTimeout(function() {
        //     this.proxy.fbChatHub.invoke("test", "abc");
        //     this.proxy.fbChatHub.invoke("test", "abc sss");
        // }.bind(this), 500);

    }

}


export default SignalRReatime;






import { server_url } from 'config';
import System from 'common/SystemVar'
var $ = window.jQuery;
class SignalRReatime {
    constructor() {
        this.proxy = {};
        this.state = "connecting";
    }

    start() {
        try {
            var connection = $.hubConnection(`${server_url}/signalr`, { useDefaultPath: false });
            this.proxy.applicationHub = connection.createHubProxy('applicationHub');
            this.proxy.applicationHub.on('test', function (userName) {
                console.log(userName)
            });
            this.proxy.rTCMultiConnectionHub = connection.createHubProxy('rTCMultiConnectionHub');
            this.proxy.rTCMultiConnectionHub.on('a', function (userName) {

            });

            connection.start()
                .done(function () {
                    console.log('Now connected, connection ID=' + connection.id);
                    this.state = "connetected";
                    //let user = JSON.parse(localStorage.getItem('User'));
                    let user = JSON.parse(System.getItem("User"));
                    if (user) {
                        this.proxy.applicationHub.invoke("joinRoom", user.CenterName, user.UserName);
                    }
                }.bind(this))
                .fail(function (e) {
                    this.state = "fail";
                    console.log('Could not connect', e);
                }.bind(this));

            window.RealTimeConnection = connection;

        }
        catch (err) {
            console.log("loi roi", err);

        }

    }

    onConnected() {
        var connection = this;
        var promise = new Promise(function (resolve, reject) {
            var i = 0;
            var timer = setInterval(function () {
                if (i > 15) {
                    clearInterval(timer);
                    reject();
                }
                if (connection.state == "connetected") {
                    clearInterval(timer);
                    resolve();
                }
                if (connection.state == "fail") {
                    clearInterval(timer);
                    reject();
                }
                i++;

            }, 1000)
        });
        return promise;
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






import { APIHelper } from "services"

export default class Ping {
    constructor() {

        this.pingToServer();
    }

    pingToServer() {
        setInterval(() => {
            APIHelper.post("User/Ping").then(data => {

            })
        }, 10 * 1000);
    }



}









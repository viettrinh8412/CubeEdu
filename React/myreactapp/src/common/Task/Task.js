import { APIHelper } from "services"


export default class Task {
    constructor() {
        this.task = {};
    }

    updatePrivateMessageSendBy(id) {
        this.task[id] = setInterval(() => {
            console.log("updatePrivateMessageSendBy", id)
            APIHelper.postUrl("fb/updateprivatecomment", { id: id }).then(data => {
                if (data.Code == 1) {
                    clearInterval(this.task[id]);
                }
            })

        }, 1000);
    }


}











class System {
    constructor() {

    }


    init() {
        this.User = localStorage.getItem('User');
    }
    getItem(key) {
        if (this[key]) {
            return this[key]
        }
        else {
            this[key] = localStorage.getItem(key);
            return this[key];
        }
    }

}


export default System;






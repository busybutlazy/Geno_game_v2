class Protocol {
    constructor() {
        this.response = new this.Response();
        this.request = new this.Request();
    }

    Response = class {
        constructor() {
            this.WAITING = "protocol.waiting";
            this.PERSON_INVALID = "protocol.person_invalid";
            this.OPPONENT = "protocol.opponent";
            this.SET_VALID = "protocol.set_valid";
            this.SET_ERROR = "protocol.set_error";
            this.GAME_INIT = "protocol.game_initialized";
            this.GAME_START = "protocol.game_start";
            this.GAME_END = "protocol.game_end";
            this.ANSWER_VALID = "protocol.answer_valid";
            this.ANSWER_INVALID = "protocol.answer_invalid";
            this.ALREADY_HIT = "protocol.already_hit";
            this.OPPONENT_LEFT = "protocol.opponent_left";
            this.UPDATE_INFO = "protocol.update_info";
            this.NOT_YOUR_TURN = "protocol.not_your_turn";
        }
    }

    Request = class {
        constructor() {
            this.ANSWER = "protocol.answer";
            this.NICKNAME = "protocol.nickname";
            this.SET_ANSWER = "protocol.set_answer";
            this.CONSOLE_LOG = "protocol.console_log";
        }
    }
}

const protocol = new Protocol();

// ✅ 讓前端可以使用 `protocol`
if (typeof window !== "undefined") {
    window.protocol = protocol;
}

// ✅ 讓後端可以 `require('protocol')`
if (typeof module !== "undefined" && module.exports) {
    module.exports = protocol;
}

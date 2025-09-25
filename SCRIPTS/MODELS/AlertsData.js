//TODO: implement class AlertsData & class Alert

class Alert {
    constructor(obj) {
        this.headline = obj.headline;
        this.msgtype = obj.msgtype;
        this.severity = obj.severity;
        this.urgency = obj.urgency;
        this.areas = obj.areas;
        this.category = obj.category;
        this.certainty = obj.certainty;
        this.event = obj.event;
        this.note = obj.note;
        this.effective = obj.effective;
        this.expires = obj.expires;
        this.desc = obj.desc;
        this.instruction = obj.instruction;
    }
}

class AlertsData {
    constructor(data) {
        this.alerts = Array.isArray(data.alerts?.alert)
            ? data.alerts.alert.map(a => new Alert(a))
            : [];
    }
}

export { AlertsData, Alert };
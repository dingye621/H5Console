import {H5sEvent} from '../../../assets/h5sevent.js'

let gEvent=[];
var e1=undefined;
function EventCB(event, userdata)
{
    var msgevent = JSON.parse(event);
    let timeitem={
            Token: msgevent.strDevToken,
            Type: msgevent.type,
            UUID:msgevent.strUUID,
            Time:msgevent.strTime,
            Detail:event,
        };
    gEvent.push(timeitem);
    //console.log(gEvent.length)
}
function events(){
    var root = process.env.API_ROOT;
    var wsroot = process.env.WS_HOST_ROOT;
    if (root == undefined){
        root = window.location.protocol + '//' + window.location.host + window.location.pathname;
    }
    if (wsroot == undefined)
    {
        wsroot = window.location.host;
    }
    var conf1 = {
        protocol: window.location.protocol, //http: or https:
        host:wsroot, //localhost:8080
        rootpath:'/', // '/'
        callback: EventCB, 
        userdata: null, // user data
        session: "c1782caf-b670-42d8-ba90-2244d0b0ee83" //session got from login
    };
    e1 = new H5sEvent(conf1);
    e1.connect();
}
events();
export default{event,gEvent}
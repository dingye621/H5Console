<template>
<div class="h5videowrapper h5container" >
    <video class="h5video" @click="redborder" :id="videoid" autoplay webkit-playsinline playsinline></video>
    <div :id="videonameid" class="">{{videoname}}</div>
    <div :id="rtcid" class=""></div>
    <div class="h5controls"  style="display:none padding:0px;">
        <button type="button" class="vidbuttion pull-right iconfont icon-roundclosefill" @click="CloseVideo($event)"></button>
        <button type="button" class="vidbuttion pull-right iconfont icon-full" @click="FullScreen($event)"></button>
        <button :id="ptz"  type="button" class="btn vidbuttion pull-right" @click="PtzControlShow($event)"></button>
        <!-- <button type="button" class="btn vidbuttion pull-right rtcbutton" > <i class="mdi mdi-format-title"></i></button> -->
        <button type="button" class="vidbuttion pull-right iconfont icon-radioboxfill" @click="DoManualRecordStop($event)"></button>
        <button type="button" class="vidbuttion pull-right iconfont icon-videofill" @click="DoManualRecordStart($event)"></button>
        <button type="button" class="vidbuttion pull-right iconfont icon-camerafill" @click="DoSnapshot($event)"></button>
        <button type="button" class="vidbuttion pull-right iconfont icon-picfill" @click="DoSnapshotWeb($event)"></button>
        <button type="button" class="vidbuttion pull-right" @click="Shoutwheat($event)"> <i :class="Shoutwheatclass"></i></button>
        <!-- audio
        <button type="button" class="btn vidbuttion pull-right" > <i class="mdi  mdi-record"></i></button>
        <button type="button" class="btn vidbuttion pull-right" href="#"> <i class="mdi mdi-volume-high"></i></button>
        <button type="button" class="btn vidbuttion pull-right" href="#"> <i class="mdi mdi-volume-off"></i></button>
        -->
    </div>

    <div class="ptzcontrols"  style="display:none padding:0px">
        
        <div class="flex_content">
            <div class="key_zoom">
                
                <div class="zoom">
                    <div class="zoom_add" @mousedown ="PtzActionZoomIn($event)" @mouseup="PtzActionStop($event)" @touchstart ="PtzActionZoomIn($event)" @touchend="PtzActionStop($event)"></div>
                    <div class="zoom_add" @mousedown ="PtzActionZoomOut($event)" @mouseup="PtzActionStop($event)" @touchstart ="PtzActionZoomOut($event)" @touchend="PtzActionStop($event)"></div>
                </div>
            
                <div class="key_flex">
                    <div class="key_but"></div>
                    <div class="key_but"  @mousedown ="PtzActionUp($event)" @mouseup="PtzActionStop($event)" @touchstart ="PtzActionUp($event)" @touchend="PtzActionStop($event)"></div>
                    <div class="key_but"></div>
                    <div class="key_but" @mousedown ="PtzActionLeft($event)" @mouseup="PtzActionStop($event)" @touchstart ="PtzActionLeft($event)" @touchend="PtzActionStop($event)"></div>
                    <div class="key_but"></div>
                    <div class="key_but" @mousedown ="PtzActionRight($event)" @mouseup="PtzActionStop($event)" @touchstart ="PtzActionRight($event)" @touchend="PtzActionStop($event)"></div>
                    <div class="key_but"></div>
                    <div class="key_but" @mousedown ="PtzActionDown($event)" @mouseup="PtzActionStop($event)" @touchstart ="PtzActionDown($event)" @touchend="PtzActionStop($event)"></div>
                    <div class="key_but"></div>
                </div>
            </div>
            <div class="Preset">
                <div class="" style="text-align: center;">
                    <el-slider v-model="Preset_value" :show-tooltip="false" :max="1" :min="0.1" :step="0.1"></el-slider>
                    <span style="color:#ffffff;">{{Preset_value}}</span>
                </div>
                <div class="block">
                    <el-timeline>
                        <el-timeline-item placement="top" v-for="Pre in Presetdata" :key="Pre.strName" >
                            <el-card>
                                <div class="preset_bgc">
                                    <input type="text" class="preset_input" :value="Pre.strName"/>
                                    <button type="button" class="iconfont icon-RectangleCopy1" @click="preset_Jump(Pre.strToken)"></button>
                                    <button type="button" class="iconfont icon-shezhi" @click="preset_set(Pre.strToken,$event)"></button>
                                </div>
                            </el-card>
                        </el-timeline-item>
                    </el-timeline>
                </div>
            </div>
        </div>
        <!-- <div class="row ">
            <button type="button" class="btn ptzbuttonnone pull-right" href="#"> <i ></i></button>
            <button type="button" class="btn ptzbutton pull-right" href="#"
                @mousedown ="PtzActionZoomIn($event)" @mouseup="PtzActionStop($event)" @touchstart ="PtzActionZoomIn($event)" @touchend="PtzActionStop($event)"> <i class="mdi  mdi-plus-circle-outline"></i></button>
            <button type="button" class="btn ptzbuttonnone pull-right" href="#"> <i ></i></button>
            <button type="button" class="btn ptzbutton pull-right" href="#"
                @mousedown ="PtzActionUp($event)" @mouseup="PtzActionStop($event)" @touchstart ="PtzActionUp($event)" @touchend="PtzActionStop($event)"> <i class="mdi  mdi-arrow-up"></i></button>
        </div>
        <div class="row ">
            <button type="button" class="btn ptzbuttonnone pull-right" href="#"> <i ></i></button>
            <button type="button" class="btn ptzbuttonnone pull-right" href="#"> <i ></i></button>
            <button type="button" class="btn ptzbutton pull-right" href="#"
                @mousedown ="PtzActionRight($event)" @mouseup="PtzActionStop($event)" @touchstart ="PtzActionRight($event)" @touchend="PtzActionStop($event)"> <i class="mdi  mdi-arrow-right"></i></button>
            <button type="button" class="btn ptzbuttonnone pull-right" href="#"> <i ></i></button>
            <button type="button" class="btn ptzbutton pull-right" href="#"
                @mousedown ="PtzActionLeft($event)" @mouseup="PtzActionStop($event)" @touchstart ="PtzActionLeft($event)" @touchend="PtzActionStop($event)"> <i class="mdi  mdi-arrow-left"></i></button>
        </div>
        <div class="row ">
            <button type="button" class="btn ptzbuttonnone pull-right" href="#"> <i ></i></button>
            <button type="button" class="btn ptzbutton pull-right" href="#"
                @mousedown ="PtzActionZoomOut($event)" @mouseup="PtzActionStop($event)" @touchstart ="PtzActionZoomOut($event)" @touchend="PtzActionStop($event)"> <i class="mdi  mdi-minus-circle-outline"></i></button>
            <button type="button" class="btn ptzbuttonnone pull-right" href="#"> <i ></i></button>
            <button type="button" class="btn ptzbutton pull-right" href="#"
                @mousedown ="PtzActionDown($event)" @mouseup="PtzActionStop($event)" @touchstart ="PtzActionDown($event)" @touchend="PtzActionStop($event)"> <i class="mdi  mdi-arrow-down"></i></button>
        </div> -->
        
        
    </div>
</div>
</template>

<script>
import '../../assets/adapter.js'
import {H5sPlayerWS,H5sPlayerHls,H5sPlayerRTC,H5sPlayerAudBack} from '../../assets/h5splayer.js'
import {H5siOS,H5sPlayerCreate} from '../../assets/h5splayerhelper.js'
export default {
    name: 'liveplayer',
    props:['h5id', 'h5videoid',"cols","rows"],
    data () {
        return {
            videoid: this.h5videoid,
            ptz:"ptz"+ this.h5videoid,
            videonameid:"name"+this.h5videoid,
            rtcid:"rtc"+this.h5videoid,
            h5handler: undefined,//视频内容
            currtoken: undefined,
            ptzshow: false,
            proto: 'WS',
            Shoutwheatclass:"mdi mdi-microphone-off",
            tokenshou:"",
            v2: undefined,//视频内容
            videoname:"",//视频名称
            Presetdata:[],//预置位数组
            Preset_value:0.5,//镜头转换速度
        }
    },
    activated() {
        //console.log(this.h5id, "activated");
    },
    deactivated() {
        //console.log(this.h5id, "deactivated");
    },
    beforeDestroy() {
        //console.log(this.h5id, "beforeDestroy");
        if (this.h5handler != undefined)
        {
            this.h5handler.disconnect();
            delete this.h5handler;
            this.h5handler = undefined;
        }
        this.currtoken = undefined;
    },
    destroyed() {
        //console.log(this.h5id, "destroyed");
    },
    mounted() {
        //console.log(this.h5id, "mount");
        var $container = $("#"+this.h5id);
        var $video =$container.children("video");
        var videodom = $container.children("video").get(0);
        var $controls = $container.children(".h5controls");
        var $rtcbutton = $controls.children(".rtcbutton");

        let _this = this;
        this.$root.bus.$on('liveplay', function(token,streamprofile,label, id)
        {
            // this.videoname=label;//视频名称
            // console.log("++++++++++++++++++++",label,this.videoname)
            if (_this.h5id != id)
            {
                return;
            }
            _this.PlayVideo(token,streamprofile,label);
            _this.tokenshou=token;
            console.log("-----------------",_this.tokenshou)
        });

        this.$root.bus.$on('liveplayproto', function(proto)
        {
            _this.proto = proto;
            //储存
            localStorage.setItem("proto",_this.proto);
            //console.log("liveplayproto", _this.proto);
        });

        // control visibility
        $container.on("mouseover mouseout touchstart touchmove", function(e) {
            $controls.css("display", e.type === "mouseout" ? "none" : "block");
            //$controls.css("display", e.type === "touchend" ? "none" : "block");
        });
    },
    methods: {
        //预置位跳转
        preset_Jump(token){
            var root = process.env.API_ROOT;
		    if (root == undefined){
		        root = window.location.protocol + '//' + window.location.host + window.location.pathname;
		    }
		   //url
		    var url = root + "/api/v1/Ptz?token="+this.tokenshou+"&action=preset&preset="+token+"&speed="+this.Preset_value+"&session="+ this.$store.state.token;
            console.log(url)
            //重组
            this.$http.get(url).then(result=>{
                if(result.status == 200){
                    console.log("跳转");
                }
            })


        },
        //预置位设置
        preset_set(token,event){
            var input_val=event.currentTarget.previousElementSibling.previousElementSibling.value;
            var root = process.env.API_ROOT;
		    if (root == undefined){
		        root = window.location.protocol + '//' + window.location.host + window.location.pathname;
		    }
		   //url
		    var url = root + "/api/v1/SetPreset?token="+this.tokenshou+"&presetname="+input_val+"&presettoken="+token+"&session="+ this.$store.state.token;
            console.log(url)
            //重组
            this.$http.get(url).then(result=>{
                if(result.status == 200){
                    console.log(result);
                }
            })
            console.log("设置");
        },
        PlayVideo(token,streamprofile,label)
        {
            this.videoname=label;//视频名称
            $("#"+this.videonameid).addClass("videoname");
            //console.log("*********************",label,token);
            if (this.h5handler != undefined)
            {
                // $("#"+this.videonameid).removeClass("videoname");
                // $("#"+this.rtcid).removeClass("rtc_new");
                this.h5handler.disconnect();
                delete this.h5handler;
                this.h5handler = undefined;
            }
            this.currtoken = token;
            //console.log("play ", token);
            //console.log("play ",streamprofile);
            var root = process.env.API_ROOT;
            var wsroot = process.env.WS_HOST_ROOT;
            if (root == undefined){
                root = window.location.protocol + '//' + window.location.host + window.location.pathname;
            }
            if (wsroot == undefined)
            {
                wsroot = window.location.host;
            }
            let conf = {
                videoid: this.h5videoid,
                protocol: window.location.protocol, //http: or https:
                host: wsroot, //localhost:8080
	            streamprofile: streamprofile, // {string} - stream profile, main/sub or other predefine transcoding profile
                rootpath: '/', // '/'
                token: token,
                hlsver: 'v1', //v1 is for ts, v2 is for fmp4
                session: this.$store.state.token //session got from login
            };
            var $container = $("#"+this.h5id);
            var $controls = $container.children(".h5controls");
            var $rtcbutton = $controls.children(".rtcbutton");

            if (this.proto == 'RTC' || (H5siOS() === true))
            {
                $rtcbutton.css("display", "block");
                this.h5handler = new H5sPlayerRTC(conf);
                $("#"+this.rtcid).addClass("rtc_new");
            }else
            {
                $rtcbutton.css("display", "none");
                this.h5handler = new H5sPlayerWS(conf);
            }

            this.h5handler.connect();
        },
        CloseVideo(event)
        {
            this.videoname="";
            var $container = $("#"+this.h5id);
            var $ptzcontrols = $container.children(".ptzcontrols");
            $ptzcontrols.css("display", "none");
            $("#"+this.videonameid).removeClass("videoname");
            $("#"+this.rtcid).removeClass("rtc_new");
            
            
            var $container = $("#"+this.h5id);
            var $controls = $container.children(".h5controls");
            var $rtcbutton = $controls.children(".rtcbutton");
            if (this.h5handler != undefined)
            {
                $rtcbutton.css("display", "none");
                this.h5handler.disconnect();
                delete this.h5handler;
                this.h5handler = undefined;
                this.$Notice.info({
                    title: "Stop successfully"
                });

                $("#" + this.h5videoid).get(0).load();
                $("#" + this.h5videoid).get(0).poster = '';

            }

            //var $container = $("#"+this.h5id);
            //var $video =$container.children("video");
            //$video.remove();
            //var videoHTML = '<video class="h5video" id=' + this.videoid + ' autoplay webkit-playsinline playsinline></video>';
            //$container.append(videoHTML);
        },
        FullScreen(event)
        {
            var elem = $("#"+this.h5id).get(0);
            //var elem = $("#videoPanel");
            console.log('panelFullScreen', event);
            if (
            document.fullscreenEnabled ||
            document.webkitFullscreenEnabled ||
            document.mozFullScreenEnabled ||
            document.msFullscreenEnabled
            ) {
                if (
                    document.fullscreenElement ||
                    document.webkitFullscreenElement ||
                    document.mozFullScreenElement ||
                    document.msFullscreenElement
                ) {
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    } else if (document.webkitExitFullscreen) {
                        document.webkitExitFullscreen();
                    } else if (document.mozCancelFullScreen) {
                        document.mozCancelFullScreen();
                    } else if (document.msExitFullscreen) {
                        document.msExitFullscreen();
                    }
                    console.log("========  updateUIExitFullScreen");
                    this.updateUIExitFullScreen();
                } else {
                     console.log('panelFullScreen3');

                    if (elem.requestFullscreen) {
                        elem.requestFullscreen();
                    } else if (elem.webkitRequestFullscreen) {
                        elem.webkitRequestFullscreen();
                    } else if (elem.mozRequestFullScreen) {
                        elem.mozRequestFullScreen();
                    } else if (elem.msRequestFullscreen) {
                        elem.msRequestFullscreen();
                    }
                }
            } else {
                console.log('Fullscreen is not supported on your browser.');
        }
        },
        updateUIExitFullScreen(){
            if (!document.fullscreenElement && !document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement)
            {
                $('div[name="flex"]').height(this.contentHeight / this.rows);
            }
        },
        PtzControlShow(event)
        {
            this.Presetdata=[];
            console.log("+++++++++",this.Presetdata);
            var root = process.env.API_ROOT;
		    if (root == undefined){
		        root = window.location.protocol + '//' + window.location.host + window.location.pathname;
		    }
		   //url
           var url = root + "/api/v1/GetPresets?token="+this.tokenshou+"&session="+ this.$store.state.token;
           console.log(url);
            //重组
            this.$http.get(url).then(result=>{
                if(result.status == 200){
                    console.log(result);
                    if(result.bStatus==false){
                        console.log("data.preset[i].strName")
                        return false;
                    }else{
                        var data=result.data;
                        for(var i = 0; i < data.preset.length; i++){
                            console.log(data.preset[i].strName)
                            var newItem ={
                                strName : data.preset[i].strName,
                                strToken : data.preset[i].strToken,};
                            this.Presetdata.push(newItem);
                            if(i>8){
                                break;
                            }
                        }
                    }
                    console.log("---------",this.Presetdata);
                }
            })

            
            var $container = $("#"+this.h5id);
            var $controls = $container.children(".ptzcontrols");
            var cors=this.cols*this.rows;
            if (this.ptzshow == false&&cors<="9")
            {
                $controls.css("display", "block");
                this.ptzshow = true;
            }else
            {
                $controls.css("display", "none");
                this.ptzshow = false;
            }
        },

        PtzActionZoomIn(event)
        {
            console.log("PtzActionZoomIn");
            this.PtzAction('zoomin');
        },
        PtzActionZoomOut(event)
        {
            this.PtzAction('zoomout');
        },
        PtzActionLeft(event)
        {
            this.PtzAction('left');
        },
        PtzActionRight(event)
        {
            this.PtzAction('right');
        },
        PtzActionUp(event)
        {
            this.PtzAction('up');
        },
        PtzActionDown(event)
        {
            this.PtzAction('down');
        },
        PtzActionStop(event)
        {
            console.log("PtzActionStop");
            this.PtzAction('stop');
        },
        PtzAction(action)
        {
            if (this.h5handler == undefined)
            {
                return;
            }
            let _this =this;
            var root = process.env.API_ROOT;
            if (root == undefined){
                root = window.location.protocol + '//' + window.location.host + window.location.pathname;
            }

            var ptzcmd = "token=" + this.currtoken + "&action=" + action + "&speed="+this.Preset_value+"";
            console.log("ptzcmd", ptzcmd);

            var url = root + "/api/v1/Ptz?" + ptzcmd  + "&session="+ this.$store.state.token;

            this.$http.get(url).then(result => {
                console.log(result);
                if (result.status == 200)
                {

                }
            }).catch(error => {
                console.log('ptz failed!', error);
            });
        },
        DoManualRecordStart(event)
        {
            if (this.h5handler == undefined)
            {
                return;
            }
            let _this =this;
            var root = process.env.API_ROOT;
            if (root == undefined){
                root = window.location.protocol + '//' + window.location.host + window.location.pathname;
            }

            var record = "token=" + this.currtoken + "&duration=300";
            console.log("record cmd", record);

            var url = root + "/api/v1/ManualRecordStart?" + record  + "&session="+ this.$store.state.token;

            this.$http.get(url).then(result => {
                console.log(result);
                if (result.status == 200)
                {
                    this.$Notice.info({
                        title: "Manual Start Record successfully"
                    })
                }
            }).catch(error => {
                console.log('Record failed!', error);
                this.$Notice.info({
                    title: "Record failed !"
                })
            });
        },
        DoManualRecordStop(event)
        {
            if (this.h5handler == undefined)
            {
                return;
            }
            let _this =this;
            var root = process.env.API_ROOT;
            if (root == undefined){
                root = window.location.protocol + '//' + window.location.host + window.location.pathname;
            }

            var record = "token=" + this.currtoken + "&duration=300";
            console.log("record cmd", record);

            var url = root + "/api/v1/ManualRecordStop?" + record  + "&session="+ this.$store.state.token;

            this.$http.get(url).then(result => {
                console.log(result);
                if (result.status == 200)
                {
                    this.$Notice.info({
                        title: "Manual Stop Record successfully"
                    })
                }
            }).catch(error => {
                console.log('Record failed!', error);
                this.$Notice.info({
                    title: "Record failed !"
                })
            });
        },
        DoSnapshot(event)
        {
            if (this.h5handler == undefined)
            {
                return;
            }
            let _this =this;
            var root = process.env.API_ROOT;
            if (root == undefined){
                root = window.location.protocol + '//' + window.location.host + window.location.pathname;
            }

            var snapshot = "token=" + this.currtoken;
            console.log("snapshot cmd", snapshot);

            var url = root + "/api/v1/Snapshot?" + snapshot  + "&session="+ this.$store.state.token;

            this.$http.get(url).then(result => {
                console.log(result);
                if (result.status == 200)
                {
                    this.$Notice.info({
                        title: "Snapshot successfully"
                    })
                }
            }).catch(error => {
                console.log('Snapshot failed!', error);
                this.$Notice.info({
                    title: "Snapshot failed !"
                })
            });
        },
        DoSnapshotWeb(event)
        {
            var fileName = '1';
            const date = new Date();
            fileName = this.currtoken + '_' + date.getFullYear() + '-' + (date.getMonth() + 1)
                         + '-' + date.getDate() + '-' + date.getHours() + '-' + date.getMinutes() + '-' + date.getSeconds();
            console.log(fileName);
            var video = $("#" + this.h5videoid).get(0);
            var w = video.videoWidth;//video.videoWidth * scaleFactor;
            var h = video.videoHeight;//video.videoHeight * scaleFactor;
            var canvas = document.createElement('canvas');
            canvas.width = w;
            canvas.height = h;
            var ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, w, h);
            var MIME_TYPE = "image/png";
            var imgURL = canvas.toDataURL(MIME_TYPE,1.0);
            // console.log(imgURL);

            var dlLink = document.createElement('a');
            dlLink.download = fileName;
            dlLink.href = imgURL;
            dlLink.dataset.downloadurl = [MIME_TYPE, dlLink.download, dlLink.href].join(':');

            document.body.appendChild(dlLink);
            dlLink.click();
            document.body.removeChild(dlLink);
        },
        //麦克风
        Shoutwheat(event){
            var tokenshou=this.tokenshou
            var conf2 = {
                protocol: window.location.protocol, //http: or https:
                host: window.location.host, //localhost:8080
                rootpath:'/', // '/' or window.location.pathname
                token:tokenshou,
                session:this.$store.state.token //session got from login
            };
            this.v2 = new H5sPlayerAudBack(conf2);
            
            var Shoutwheat=this.Shoutwheatclass;
            if(Shoutwheat=="mdi mdi-microphone-off"){
                this.v2.connect();
                this.Shoutwheatclass="mdi mdi-microphone";
            }else{
                this.v2.disconnect();
                this.Shoutwheatclass="mdi mdi-microphone-off";
            }
        },
        redborder(){
            var cors=this.cols*this.rows;
            if(cors>9){
                console.log("//////////////",this.ptz)
                document.getElementById(this.ptz).style.display="none";
            }
            if(cors<=9){
                document.getElementById(this.ptz).style.display="block";
            }
            //console.log("122514541561",this.videoid);
            $("video").removeClass('h5videoh');
            $("#"+this.videoid).addClass('h5videoh');
        }
    }
}
//fill scale-down
</script>

<style scoped>
.flex_content{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    background: rgba(0,0,0,0.3);
    padding: 8% 0 0 0;
    position: relative;
}
.key_zoom{
    width: 25%;
    margin: 0 4% 0 8%;
    position: absolute;
    bottom: 4%;
}
.Preset{
    width: 30%;
    position: absolute;
    bottom: 4%;
    right: 4%;
}
.block{
    width: 100%;
    height: 175px;
    margin-right: 4%;
    overflow: auto;
    color: #FFFFFF;
}

.block::-webkit-scrollbar{
    display: none;
}
.videoname{
    position: absolute;
    bottom: 0px;
    font-size:14px;
    background-color: rgba(0,0,0,0.3);
    color: #FFFFFF;
    /* width: 37px; */
    padding: 8px 24px;
    /* float:right;
    word-wrap:break-word;
    word-break:nomal; */
    text-align: center;

}
/* 预置位 */
.el-timeline {
    margin: 0;
    font-size: 14px;
    list-style: none;
    padding-left: 4px;
}
.Preset_val{
    float: right;
}
.el-slider >>> .el-slider__runway{
    margin: 2px 0;
    background-color: rgba(255,255,255,0.2);
}
.el-slider >>> .el-slider__button{
    border: rgba(121, 120, 120, 0.1) 3px solid;
    width: 14px;
    height: 14px;
    background: rgba(255,255,255,1);
}
.el-slider >>> .el-slider__bar{
    background-color: #e1e1e1;
}
.el-timeline >>> .el-timeline-item__tail {
    position: absolute;
    left: 4px;
    height: 100%;
    border-left: 2px solid #E4E7ED;
    margin-top: 7px;
}
.el-timeline >>> .el-timeline-item{
    padding: 0;
}
.el-timeline >>> .el-timeline-item__node--normal {
    left: -1px;
    width: 12px;
    height: 12px;
    margin-top: 7px;
}
.el-timeline >>> .el-timeline-item__timestamp.is-top{
    margin: 0;
}
.el-timeline >>>.el-card{
    border: 0px;
    background: none;
}
.el-timeline >>> .el-card__body{
    display: block;
    padding: 0;
}
.block .preset_bgc{
    width:100%;
    height:24px;
    background:rgba(255,255,255,0.2);
}
.block .preset_bgc .preset_input{
    width: 60%;
    background:none;
    /* opacity:0.2; */
    border-radius:12px;
    border: 0;
    padding: 0 0 0 10px;
    color:rgba(255,255,255,1)!important;
}
.block .preset_bgc button{
    width: 15%;
    background: none;
    border: 0;
    font-size: 15px;
    color: #ffffff;
}

/* 加减 */

.zoom{
    width: 26px;
    height: 80px;
    line-height: 40px;
    /* background-color: #808181; */
}
.zoom_add{
    width: 100%;
    height: 40px;
}
.zoom .zoom_add:nth-child(1){
    background:url("../views/gallery/jia@2x.png") no-repeat;
    background-size: 100%;
    background-position:center center;
}
.zoom .zoom_add:nth-child(2){
    background:url("../views/gallery/jian@2x.png") no-repeat;
    background-size: 100%;
    background-position:center center;
}

/* 上下左右 */
.key_flex{
    width: 100px;
    height: 100px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-left: 20%;
    /* margin-bottom: 20px; */
}
.key_but{
    width: 33.33%;
    height: 33.33%;
    text-align: center;
    /* background-color: #FF0000; */
}
.key_flex .key_but:nth-child(2){
    background:url("../views/gallery/shang@2x.png") no-repeat;
    background-size: contain;
    background-position:center center
}
.key_flex .key_but:nth-child(4){
    background:url("../views/gallery/you@2x.png") no-repeat;
    background-size: contain;
    background-position:center center
}
.key_flex .key_but:nth-child(6){
    background:url("../views/gallery/zuo@2x.png") no-repeat;
    background-size: contain;
    background-position:center center
}
.key_flex .key_but:nth-child(8){
    background:url("../views/gallery/xia@2x.png") no-repeat;
    background-size: contain;
    background-position:center center
}



.h5video{
   object-fit: fill;
}
.h5videoh{
    border: 1px solid #f44336 !important;
    box-sizing: border-box;
    -moz-box-sizing:border-box;
    -webkit-box-sizing:border-box;
}

.h5videowrapper{
    padding: 0px;
    height: 100%;
    width: 100%;
}

video {
    width: 100%;
    height: 100%
}

.vidbuttion {
    height: 24px;
    width: 24px;
    padding:0px;
    margin: 0px;
    margin-left: 5px;
    opacity: 0.9;
    padding: 0 2px;
    color:#FFFFFF;
    font-size: 18px;
    background: none;
    border: 0;

}
.vidbuttion:hover{
    color: #ffffff !important;
}
.vidbuttion:nth-child(1){
    margin-right: 20px;
    background: none;
}
.vidbuttion:nth-child(3){
    background:url("../views/gallery/yuntai.svg") no-repeat;
    background-size: 90%;
    background-position:center center;
    margin-top: 2px;
}
.vidbuttion:nth-child(8){
    background:none;
}



.ptzbutton {
    height: 24px;
    width: 24px;
    padding:0px;
    margin: 0px;
    opacity: 1;
    background:rgba(255,255,255,0.3);
}

.ptzbuttonnone {
    height: 24px;
    width: 24px;
    padding:0px;
    margin: 0px;
    margin-right: 0px;
    opacity: 0;
    background:rgba(255,255,255,0);
}

.ptzbutton:hover {
    /*background-color: #3c8dbc;*/
    color:#ffffff;
}

.h5container {
    position:relative;
    display:inline-block;
}

.rtcbutton {
    display:none;
}
.rtc_new{
    width: 25px;
    height: 25px;
    margin: 10px;
    background:url("../views/gallery/rtc.svg") no-repeat;
    background-size: contain;
    background-position:center center;
    position: absolute;
    top: 0px;
}

.h5container > .h5controls {
    position:absolute;
    top:0;
    background:url("../views/gallery/videoxlk@2x.png") no-repeat;
    background-size: 300px;
    background-position-x:right;
    padding:0px;
    box-sizing:content-box;
    z-index:10000;
    width: 100%;
    height: 32px;
    display:none;
}
.h5container > .ptzcontrols {
    position:absolute;
    bottom:0;
    background:rgba(255,255,255,0);
    padding:0px;
    box-sizing:content-box;
    z-index:1100;
    width: 100%;
    height: 100%;
    display:none;
}


</style>

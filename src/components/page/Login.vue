<template>
    <div>
        <el-tabs v-model="activeName">
            <el-tab-pane label="By File(文件识别)" name="first">
                <el-row :gutter="20">
                    <el-upload
                        drag
                        ref="uploadMusic"
                        action=""
                        accept="audio/wav"
                        :file-list="musicFileList"
                        :data="uploadMusicParam"
                        :on-change="selectMusic"
                        :show-file-list="false"
                        :auto-upload="false">
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将wav文件拖到此处，或<em>点击此处</em></div>
                        <div slot="tip" class="el-upload__tip">----TIPS: The file format of WAV, 16000Hz, single track ,size is (suggest)less than 500kb(文件格式为wav、16000Hz,单音轨. 大小建议不超过500kb)</div>
                    </el-upload>
                </el-row>
                <el-row :gutter="20">
                    <ul>
                        <li v-if="musicList">
                            <div>
                                <el-button type="primary" @click="uploadMusic">upload</el-button>
                                <span :title="musicList.name">您当前缓存的音频是：{{musicList.name}} 本次上传时间 {{utime}} 秒</span>
                            </div>
                        </li>
                    </ul>
                </el-row>
                <div style="margin: 15px 0;"></div>

                <el-row :gutter="20">
                    <el-input
                        type="textarea"
                        autosize=""
                        placeholder="Please enter ASR Recognition Standard Text(请输入ASR识别标准文本)"
                        v-model="tmpdata">
                    </el-input>
                </el-row>
                <el-row :gutter="20">
                    <el-button type="success" @click="getScore">Check</el-button>
                    <p>--------日语识别,如何使用:</p>
                    <p>-------1 上传wav文件至浏览器缓存</p>
                    <p>-------2 点击upload将音频上传到服务器</p>
                    <p>-------3 点击check按钮进行语音识别</p>
                    <p>-------(注意:此为体验版，不支持高并发)</p>
                    <p> -------How to use Japanese recognition:</p>
                    <p> ------1Upload wav file to browser cache</p>
                    <p> ------2 click upload to upload audio to server</p>
                    <p> ------3 Click the check button for speech recognition</p>
                    <p> ------(Note: This is an experience edition and does not support high concurrency)</p>
                </el-row>

            </el-tab-pane>
            <el-tab-pane label="By Recording(录音识别)" name="second">
                <el-button @click="startRecording()" :disabled="isRstart">Start recording (开始录音)</el-button>
                <el-button @click="stopRecording()" :disabled="isRover">Stop recording(停止录音)</el-button>
                <label>{{Rstatus}}</label>
                <el-button type="primary" @click="funUpload()" :disabled="iscanup">upload</el-button>
                <label>本次上传时间 {{utime}} 秒</label>

                <ul id="recordingslist"></ul>
                <div style="margin: 15px 0;"></div>

                <el-row :gutter="20">
                    <el-input
                        type="textarea"
                        autosize=""
                        placeholder="Please enter ASR Recognition Standard Text(请输入ASR识别标准文本)"
                        v-model="tmpdata">
                    </el-input>
                </el-row>
                <el-row :gutter="20">
                    <el-button type="success" @click="getScore">check</el-button>
                    <p>--------日语识别,如何使用:</p>
                    <p>-------1 上传wav文件至浏览器缓存</p>
                    <p>-------2 点击upload将音频上传到服务器</p>
                    <p>-------3 点击check按钮进行语音识别</p>
                    <p>-------(注意:此为体验版，不支持高并发)</p>
                    <p> -------How to use Japanese recognition:</p>
                    <p> ------1Upload wav file to browser cache</p>
                    <p> ------2 click upload to upload audio to server</p>
                    <p> ------3 Click the check button for speech recognition</p>
                    <p> ------(Note: This is an experience edition and does not support high concurrency)</p>

                </el-row>
            </el-tab-pane>

        </el-tabs>
        <el-dialog title="识别结果" :visible.sync="dialogFormVisible">



                    <el-row :gutter="20">
                        <el-col :span="20">
                            <span>标准文本：{{tmpdata}} </span>
                        </el-col>
                    </el-row>
            <el-row :gutter="20">
                        <el-col :span="20">
                            <span>识别文本：{{asrdata}} </span>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="20">
                            <span>得分: {{score}} </span>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="20">
                            <span>耗时: {{wtime}} 秒 </span></el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="20">
                            <el-button type="primary" @click="dialogFormVisible=false">ok</el-button>
                        </el-col>
                    </el-row>
                </el-dialog>



                <el-dialog title="音频试听" :visible.sync="dialogFormVisible2">
                    <audio :src=listenurl controls="controls">
                    </audio>
                </el-dialog>
        <el-dialog title="音频试听" :visible.sync="dialogFormVisible2">
            <audio :src=listenurl controls="controls">
            </audio>
        </el-dialog>
    </div>

</template>
<script>
    // import Recorder from '../../../../static/js/recorder';
    import Recorder from 'recorder-js';

    export default {

        data: function () {
            return {
                guserid : '',
                asrtype: [],
                addtype: '',
                deltype: '',
                dftype: '',
                listenurl: '',
                dialogFormVisible: false,
                dialogFormVisible2: false,
                dialogFormVisible3: false,
                dialogFormVisible4: false,
                dialogFormVisible5: false,
                dialogFormVisible7: false,
                tmpdata: '',
                musicList: '',
                musicFileList: [],
                uploadMusicParam: {
                    userid: 'test'
                },
                asrdata: '',
                score: 0,
                utime: '',
                wtime: '',
                beizhu: '',
                last_asr_time: 0.00,
                cansave: false,
                //历史数据
                tableData: [],
                cur_page: 1,
                search: '',
                total: 0,
                //模板数据
                DemoTableData: [],
                demo_cur_page: 1,
                demo_search: '',
                demo_total: 0,
                activeName: 'first',
                audio_context: null,
                recorder: null,
                isRstart: false,
                isRover: true,
                iscanup: true,
                Rstatus: '',
                wavBlob: null,
                sampleRate: 1,
                try_filename: ''
            }
        },
        created() {
            this.guserid = Math.random().toString(36).substr(2);
        },
        mounted() {
            // try {
            //     // webkit shim
            //     window.AudioContext = window.AudioContext || window.webkitAudioContext;
            //     navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
            //     window.URL = window.URL || window.webkitURL;
            //
            //     this.audio_context = new AudioContext;
            //     // this.__log('Audio context set up.');
            //     // this.__log('navigator.getUserMedia ' + (navigator.getUserMedia ? 'available.' : 'not present!'));
            // } catch (e) {
            //     alert('No web audio support in this browser!');
            // }
            // navigator.getUserMedia({audio: true}, this.startUserMedia, function (e) {
            //     //this.__log('No live audio input: ' + e);
            // });
            const self = this
            self.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            self.recorder = new Recorder(self.audioContext, {
                // An array of 255 Numbers
                // You can use this to visualize the audio stream
                // If you use react, check out react-wave-stream
                //  onAnalysed: data => console.log(data),
            });

            navigator.mediaDevices.getUserMedia({audio: true})
                .then(stream => self.recorder.init(stream))
                .catch(err => console.log('Uh oh... unable to get stream...', err));
        },

        methods: {

            ////录音模块
            startRecording() {
                const self = this
                self.recorder.start()
                    .then(() => {
                        self.isRstart = true
                        self.isRover = false
                        self.iscanup = true
                        self.Rstatus = '录音中...'
                    })
            }
            ,
            stopRecording() {
                const self = this
                self.recorder.stop()
                    .then(({blob, buffer}) => {
                        self.wavBlob = blob;
                        self.createDownloadLink(blob);
                        self.isRover = true
                        self.isRstart = false
                        self.Rstatus = '录音完成'
                        self.iscanup = false
                        // buffer is an AudioBuffer
                    })
            },


            //callback() {
            //     console.log('ok')
            // },
            funUpload() {
                const self = this
                self.utime = '计算中'
                let data;
                const reader = new window.FileReader();
                reader.readAsDataURL(self.wavBlob);
                reader.onloadend = function () {
                    data = reader.result;
                    self.base64Data = data;
                    self.$axios.post(self.GLOBAL.dev + '/recordwavupload', {
                        file: data,
                        userid: self.guserid,
                    }).then(res => {
                        if (res.data.code === 10000) {
                            self.utime = res.data.wtime.toString()
                            self.$message('上传成功');
                        } else {
                            self.$message('网络异常');
                        }
                    })
                };
            },
            // ,
            // __log(e, data) {
            //     log.innerHTML += "\n" + e + " " + (data || '');
            // }
            // ,
            // startUserMedia(stream) {
            //     const self = this
            //     var input = self.audio_context.createMediaStreamSource(stream);
            //     //this.__log('Media stream created.');
            //     console.log('edia stream created.')
            //     // Uncomment if you want the audio to feedback directly
            //     //input.connect(audio_context.destination);
            //     //__log('Input connected to audio context destination.');
            //     console.log('Input connected to audio context destination.')
            //
            //     self.recorder = new Recorder(input, {numChannels: 1, mySampleRate: 16000});
            //     //this.__log('Recorder initialised.');
            //     console.log('Recorder initialised.')
            //
            // }
            // ,
            //
            // startRecording() {
            //     const self = this
            //     self.recorder && self.recorder.record();
            //
            //     //this.__log('Recording...');
            //     self.isRstart = true
            //     self.isRover = false
            //     self.iscanup = true
            //     self.Rstatus = '录音中...'
            //
            // }
            // ,
            // stopRecording(button) {
            //     const self = this
            //
            //     self.recorder && self.recorder.stop();
            //
            //     //this.__log('Stopped recording.');
            //
            //     // create WAV download link using audio data blob
            //     self.createDownloadLink();
            //     self.recorder.clear();
            //     self.isRover = true
            //     self.isRstart = false
            //     self.Rstatus = '录音完成'
            //     self.iscanup = false
            //
            // }
            // ,
            createDownloadLink(blob) {
                ///这里拿得到
                const self = this

                var url = URL.createObjectURL(blob);
                self.wavBlob = blob
                var li = document.createElement('li');
                var au = document.createElement('audio');
                var hf = document.createElement('a');
                au.controls = true;
                au.src = url;
                hf.href = url;
                hf.download = new Date().toISOString() + '.wav';
                hf.innerHTML = hf.download;
                li.appendChild(au);
                li.appendChild(hf);
                var tab = document.getElementById("recordingslist");
                for (var i = tab.childNodes.length - 1; i >= 0; i--) {
                    tab.removeChild(tab.childNodes[i]);
                }
                recordingslist.appendChild(li);

            }
            ,

            formatDate: function (row, column) {
                var date = row[column.property];
                var date = new Date(date * 1000);//如果date为10位不需要乘1000

                var Y = date.getFullYear() + '-';
                var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
                var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
                var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
                var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
                var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
                return Y + M + D + h + m + s;
            }
            ,
            selectMusic(file, fileList) {
                this.musicList = file;
            }
            ,
            handleCurrentChange(val) {
                this.cur_page = val;
                this.getdata()
            }
            ,
            demoHandleCurrentChange(val) {
                this.demo_cur_page = val;
                this.getdata()
            },

            uploadMusic() {
                this.utime = '计算中';
                let data;
                const t = this;
                const reader = new window.FileReader();
                reader.readAsDataURL(this.musicList.raw);
                reader.onloadend = function () {
                    data = reader.result;
                    t.base64Data = data;
                    t.$axios.post(t.GLOBAL.dev + '/wavupload', {
                        file: data,
                        userid: t.guserid,
                    }).then(res => {
                        if (res.data.code === 10000) {
                            t.utime = res.data.wtime.toString()
                            t.$message('上传成功');
                        } else {
                            t.$message('网络异常');
                        }
                    })
                };
            }
            ,
            getScore() {
                {
                    this.cansave = false;
                    this.dialogFormVisible = true;
                    this.wtime = '计算中';
                    const self = this;
                    self.score = '   正在计算中...   '
                    self.asrdata = '   正在识别中...  '
                    self.url = this.GLOBAL.dev + '/jpasrcheck'
                    self.$axios.post(self.url, {
                            "userid": self.guserid,
                            "tmpdata": this.tmpdata
                        }
                    ).then((res) => {
                        if (res.data.code === 10000) {
                            self.score = res.data.data.score
                            self.asrdata = res.data.data.asr_data
                            self.wtime = res.data.wtime.toString()
                            self.last_asr_time = res.data.wtime
                            this.cansave = true
                        } else {
                            if (res.data.code === 40003) {
                                this.$message('音频异常');
                            } else {
                                this.$message('网络异常');
                            }
                        }
                    })
                }
            }
        }
    }
</script>

<style>

</style>

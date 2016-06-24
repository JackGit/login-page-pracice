CC.define('LiveStreaming', {

    props: {
        videoSrc: 'http://stream3.fjtv.net/xwpd/sd/live.m3u8?_upt=f7fed7a91466572439',
        videoWidth: 640,
        videoHeight: 320,
        videoPostImage: 'http://www.fjtv.net/t/1/5/images/play13_logo.jpg',
        mountNode: '' //#liveStreamingContainer
    },

    data: {
        videoEl: null
    },

    ready: function() {
        this.$methods.getLiveStreamingInfo();
    },

    methods: {
        createVideoTag: function() {
            var video = document.createElement('video');

            video.preload = 'none';
            video.poster = this.$props.videoPostImage;
            video.src = this.$props.videoSrc;
            video.width = $(window).width();
            video.height = $(window).width() * this.$props.videoHeight / this.$props.videoWidth;
            video.controls = true;
            video.style.backgroundColor = 'black';
            video.style.display = 'block';
            video.setAttribute('webkit-playsinline', true);

            return video;
        },

        init: function() {
            var videoTag = this.$methods.createVideoTag();
            var bannerContainer;

            if(this.$props.mountNode) {
                document.querySelector(this.$props.mountNode).appendChild(videoTag);
            } else {
                bannerContainer = document.getElementById('bannerContainer');
                bannerContainer.parentElement.insertBefore(videoTag, bannerContainer);
            }

            this.videoEl = videoTag;
        },

        getLiveStreamingInfo: function() {
            var that = this;

            $.ajax({
                url: com.wy.RHPlatform.Constants.AJAX_SERVER_URL + 'stream-config/getPlayList2',
                dataType: 'jsonp',
                data: {
                    channelCode: com.wy.RHPlatform.Constants.CHANNEL
                },
                success: function(response) {
                    if(data.ret == '0' && response.data[0]) {
                        var newSrc = response.data[0].channel_stream && response.data[0].channel_stream[0] && response.data[0].channel_stream[0].m3u8;
                        var newPost = response.data[0].snap && response.data[0].snap.host + response.data[0].snap.dir + response.data[0].snap.filepath + response.data[0].snap.filename;

                        if(newSrc && newSrc !== that.$props.videoPostImage) {
                            that.$props.videoPostImage = newPost;
                            that.$props.videoSrc = newSrc;
                            that.$method.init();
                        }
                    }
                }
            });
        }
    }
});

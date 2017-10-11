var timer = false;
module.exports = {
    
    show: function(cfg) {
        var that = this
        that.setData({
            message: {
                content: cfg.content,
                icon: cfg.icon,
                extraIconClass: cfg.extraIconClass,
                visiable: true
            }
        })
        if (typeof cfg.duration !== 'undefined') {
            clearTimeout(timer)
            timer = setTimeout(function(){
                that.setData({
                    message: {
                        visiable: false
                    }
                })
            }, cfg.duration)
        }
    },
    hide: function() {
        var that = this
        that.setData({
            message: {
                visiable: false
            }
        })
    }
}
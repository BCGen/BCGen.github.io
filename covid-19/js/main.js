const app = {
  app: '#app',
  data() {
    return {
      autoOpenSMS: true,
      message: '',
      infoMessage: '取得資訊中，請稍候...',
      isCameraReady: false,
      title: '簡訊實聯制',
      phone: 1922,
    }
  },
  mounted() {
    this.init()
  },
  computed: {
    href() {
      return `sms:${this.phone}?&body=${this.message}`
    },
  },
  methods: {
    handleClick() {
      window.open(this.href, '_blank')
      this.message = ''
    },
    onQrCodeUpdate(message) {
      this.message = message

      if (this.autoOpenSMS) {
        this.handleClick()
      }
    },
    async init() {
      try {
        const devices = await Html5Qrcode.getCameras()

        if (devices && devices.length) {
          const cameraId = devices[devices.length - 1].id
          const html5QrCode = new Html5Qrcode('reader')
          this.isCameraReady = true

          html5QrCode
            .start(
              cameraId,
              {
                fps: 10, // Optional frame per seconds for qr code scanning
                qrbox: 250, // Optional if you want bounded box UI
              },
              this.onQrCodeUpdate,
              (errorMessage) => {
                this.infoMessage = errorMessage
              }
            )
            .catch((err) => {
              this.infoMessage = '無法取得相機資訊，請確認是否開啟使用權限'
              // Start failed, handle it.
            })
        }
      } catch (e) {
        this.infoMessage = '無法取得相機資訊，請確認是否開啟使用權限'
      }
    },
  },
}

Vue.createApp(app).mount('#app')

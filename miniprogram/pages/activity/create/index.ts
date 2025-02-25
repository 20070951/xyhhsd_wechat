interface IFormData {
    title: string;
    time: string;
    location: string;
    maxCount: number;
    price: number;
    coverImage: string;
    description: string;
}

interface IPageData {
    formData: IFormData;
    rules: any[];
    dateTimeArray: string[][];
    dateTimeIndex: number[];
}

Page<IPageData>({
    data: {
        formData: {
            title: '',
            time: '',
            location: '',
            maxCount: 0,
            price: 0,
            coverImage: '',
            description: ''
        },
        rules: [
            {
                name: 'title',
                rules: [
                    { required: true, message: '请输入活动标题' }
                ]
            },
            {
                name: 'time',
                rules: [
                    { required: true, message: '请选择活动时间' }
                ]
            },
            {
                name: 'location',
                rules: [
                    { required: true, message: '请输入活动地点' }
                ]
            },
            {
                name: 'maxCount',
                rules: [
                    { required: true, message: '请输入人数上限' }
                ]
            },
            {
                name: 'price',
                rules: [
                    { required: true, message: '请输入报名费用' }
                ]
            },
            {
                name: 'coverImage',
                rules: [
                    { required: true, message: '请上传活动图片' }
                ]
            }
        ],
        dateTimeArray: [],
        dateTimeIndex: [0, 0, 0, 0, 0]
    },

    onLoad() {
        this.initDateTimePicker()
    },

    initDateTimePicker() {
        const date = new Date()
        const years: string[] = []
        const months: string[] = []
        const days: string[] = []
        const hours: string[] = []
        const minutes: string[] = []

        for (let i = date.getFullYear(); i <= date.getFullYear() + 1; i++) {
            years.push(String(i))
        }
        for (let i = 1; i <= 12; i++) {
            months.push(i < 10 ? `0${i}` : String(i))
        }
        for (let i = 1; i <= 31; i++) {
            days.push(i < 10 ? `0${i}` : String(i))
        }
        for (let i = 0; i < 24; i++) {
            hours.push(i < 10 ? `0${i}` : String(i))
        }
        for (let i = 0; i < 60; i++) {
            minutes.push(i < 10 ? `0${i}` : String(i))
        }

        this.setData({
            dateTimeArray: [years, months, days, hours, minutes]
        })
    },

    onInputTitle(e: any) {
        this.setData({
            'formData.title': e.detail.value
        })
    },

    onDateTimeChange(e: any) {
        const value = e.detail.value
        const dateTimeArray = this.data.dateTimeArray
        const time = `${dateTimeArray[0][value[0]]}-${dateTimeArray[1][value[1]]}-${dateTimeArray[2][value[2]]} ${dateTimeArray[3][value[3]]}:${dateTimeArray[4][value[4]]}`

        this.setData({
            dateTimeIndex: value,
            'formData.time': time
        })
    },

    onInputLocation(e: any) {
        this.setData({
            'formData.location': e.detail.value
        })
    },

    onInputMaxCount(e: any) {
        this.setData({
            'formData.maxCount': parseInt(e.detail.value)
        })
    },

    onInputPrice(e: any) {
        this.setData({
            'formData.price': parseFloat(e.detail.value)
        })
    },

    onInputDescription(e: any) {
        this.setData({
            'formData.description': e.detail.value
        })
    },

    async onChooseImage() {
        try {
            const res = await wx.chooseImage({
                count: 1,
                sizeType: ['compressed'],
                sourceType: ['album', 'camera']
            })

            // TODO: 上传图片到服务器
            // const uploadRes = await wx.cloud.uploadFile({
            //   cloudPath: `activity/${Date.now()}.jpg`,
            //   filePath: res.tempFilePaths[0]
            // })

            this.setData({
                'formData.coverImage': res.tempFilePaths[0]
            })
        } catch (error) {
            console.error('选择图片失败:', error)
            wx.showToast({
                title: '选择图片失败',
                icon: 'none'
            })
        }
    },

    onRemoveImage() {
        this.setData({
            'formData.coverImage': ''
        })
    },

    async onSubmit() {
        const form = this.selectComponent('#form')
        const validateRes = await form.validate()

        if (validateRes.length > 0) {
            wx.showToast({
                title: validateRes[0].message,
                icon: 'none'
            })
            return
        }

        try {
            wx.showLoading({
                title: '发布中...'
            })

            // TODO: 调用后端API创建活动
            // const res = await wx.cloud.callFunction({
            //   name: 'createActivity',
            //   data: this.data.formData
            // })

            wx.hideLoading()
            wx.showToast({
                title: '发布成功',
                icon: 'success'
            })

            setTimeout(() => {
                wx.navigateBack()
            }, 1500)
        } catch (error) {
            console.error('发布活动失败:', error)
            wx.hideLoading()
            wx.showToast({
                title: '发布失败',
                icon: 'none'
            })
        }
    }
}) 
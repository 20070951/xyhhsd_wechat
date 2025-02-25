interface ISignupForm {
    name: string;
    phone: string;
    remark: string;
}

interface IActivity {
    id: number;
    title: string;
    coverImage: string;
    time: string;
    location: string;
    maxCount: number;
    price: number;
    signupCount: number;
    deadline: string;
    description: string;
    isCollected: boolean;
    signupList: Array<{
        id: number;
        avatar: string;
        nickname: string;
        signupTime: string;
    }>;
}

interface IPageData {
    activity: IActivity;
    showSignupDialog: boolean;
    signupForm: ISignupForm;
    rules: any[];
}

Page<IPageData>({
    data: {
        activity: {
            id: 0,
            title: '',
            coverImage: '',
            time: '',
            location: '',
            maxCount: 0,
            price: 0,
            signupCount: 0,
            deadline: '',
            description: '',
            isCollected: false,
            signupList: []
        },
        showSignupDialog: false,
        signupForm: {
            name: '',
            phone: '',
            remark: ''
        },
        rules: [
            {
                name: 'name',
                rules: [{ required: true, message: '请输入姓名' }]
            },
            {
                name: 'phone',
                rules: [
                    { required: true, message: '请输入手机号' },
                    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确' }
                ]
            }
        ]
    },

    onLoad(options) {
        const id = Number(options.id)
        this.getActivityDetail(id)
    },

    async getActivityDetail(id: number) {
        try {
            // TODO: 调用后端API获取活动详情
            // const res = await wx.cloud.callFunction({
            //   name: 'getActivityDetail',
            //   data: { id }
            // })

            // 模拟数据
            const mockData = {
                id: 1,
                title: '周末5人制足球友谊赛',
                coverImage: '/assets/images/activity1.jpg',
                time: '2024-02-24 14:00',
                location: '阳光体育场',
                maxCount: 10,
                price: 30,
                signupCount: 8,
                deadline: '2024-02-23 22:00',
                description: '周末一起踢球，增进友谊，锻炼身体！\n\n比赛规则：\n1. 5人制，每队可替补3人\n2. 每场比赛时间30分钟\n3. 请自备运动装备\n4. 场地提供足球和饮用水',
                isCollected: false,
                signupList: [
                    {
                        id: 1,
                        avatar: '/assets/images/avatar1.jpg',
                        nickname: '球王',
                        signupTime: '2024-02-20 10:00'
                    },
                    {
                        id: 2,
                        avatar: '/assets/images/avatar2.jpg',
                        nickname: '足球小将',
                        signupTime: '2024-02-20 10:30'
                    }
                ]
            }

            this.setData({
                activity: mockData
            })
        } catch (error) {
            console.error('获取活动详情失败:', error)
            wx.showToast({
                title: '获取活动详情失败',
                icon: 'none'
            })
        }
    },

    onCollect() {
        // TODO: 调用后端API收藏/取消收藏活动
        this.setData({
            'activity.isCollected': !this.data.activity.isCollected
        })

        wx.showToast({
            title: this.data.activity.isCollected ? '收藏成功' : '已取消收藏',
            icon: 'success'
        })
    },

    onShareAppMessage() {
        return {
            title: this.data.activity.title,
            path: `/pages/activity/detail/index?id=${this.data.activity.id}`
        }
    },

    onSignup() {
        this.setData({
            showSignupDialog: true
        })
    },

    onSignupDialogTap(e: any) {
        const index = e.detail.index

        if (index === 0) {
            // 点击取消
            this.setData({
                showSignupDialog: false
            })
        } else {
            // 点击确认报名
            this.submitSignup()
        }
    },

    onInputName(e: any) {
        this.setData({
            'signupForm.name': e.detail.value
        })
    },

    onInputPhone(e: any) {
        this.setData({
            'signupForm.phone': e.detail.value
        })
    },

    onInputRemark(e: any) {
        this.setData({
            'signupForm.remark': e.detail.value
        })
    },

    async submitSignup() {
        const form = this.selectComponent('#signupForm')
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
                title: '提交中...'
            })

            // TODO: 调用后端API提交报名信息
            // const res = await wx.cloud.callFunction({
            //   name: 'signup',
            //   data: {
            //     activityId: this.data.activity.id,
            //     ...this.data.signupForm
            //   }
            // })

            wx.hideLoading()
            wx.showToast({
                title: '报名成功',
                icon: 'success'
            })

            this.setData({
                showSignupDialog: false
            })

            // 刷新活动详情
            this.getActivityDetail(this.data.activity.id)
        } catch (error) {
            console.error('报名失败:', error)
            wx.hideLoading()
            wx.showToast({
                title: '报名失败',
                icon: 'none'
            })
        }
    }
}) 
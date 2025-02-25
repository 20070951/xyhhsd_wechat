interface IUserInfo {
    avatarUrl?: string;
    nickName?: string;
}

interface IStats {
    createdCount: number;
    joinedCount: number;
    collectedCount: number;
    unreadCount: number;
}

interface IPageData {
    userInfo: IUserInfo;
    stats: IStats;
}

Page<IPageData>({
    data: {
        userInfo: {},
        stats: {
            createdCount: 0,
            joinedCount: 0,
            collectedCount: 0,
            unreadCount: 0
        }
    },

    onLoad() {
        this.getUserInfo()
        this.getStats()
    },

    async getUserInfo() {
        try {
            // TODO: 调用后端API获取用户信息
            // const res = await wx.cloud.callFunction({
            //   name: 'getUserInfo'
            // })

            // 模拟数据
            const mockData = {
                avatarUrl: '/assets/images/default-avatar.png',
                nickName: '测试用户'
            }

            this.setData({
                userInfo: mockData
            })
        } catch (error) {
            console.error('获取用户信息失败:', error)
        }
    },

    async getStats() {
        try {
            // TODO: 调用后端API获取统计数据
            // const res = await wx.cloud.callFunction({
            //   name: 'getUserStats'
            // })

            // 模拟数据
            const mockData = {
                createdCount: 2,
                joinedCount: 5,
                collectedCount: 3,
                unreadCount: 1
            }

            this.setData({
                stats: mockData
            })
        } catch (error) {
            console.error('获取统计数据失败:', error)
        }
    },

    async onGetUserInfo(e: any) {
        if (e.detail.userInfo) {
            try {
                // TODO: 调用后端API更新用户信息
                // await wx.cloud.callFunction({
                //   name: 'updateUserInfo',
                //   data: e.detail.userInfo
                // })

                this.setData({
                    userInfo: e.detail.userInfo
                })
            } catch (error) {
                console.error('更新用户信息失败:', error)
                wx.showToast({
                    title: '更新用户信息失败',
                    icon: 'none'
                })
            }
        }
    },

    async onChooseAvatar(e: any) {
        try {
            // TODO: 调用后端API上传头像
            // const res = await wx.cloud.uploadFile({
            //   cloudPath: `avatar/${Date.now()}.jpg`,
            //   filePath: e.detail.avatarUrl
            // })

            this.setData({
                'userInfo.avatarUrl': e.detail.avatarUrl
            })
        } catch (error) {
            console.error('上传头像失败:', error)
            wx.showToast({
                title: '上传头像失败',
                icon: 'none'
            })
        }
    },

    onNavigateTo(e: any) {
        const url = e.currentTarget.dataset.url
        wx.navigateTo({ url })
    }
}) 
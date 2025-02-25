Page({
    data: {
        banners: [
            {
                id: 1,
                imageUrl: '/assets/images/banner1.jpg'
            },
            {
                id: 2,
                imageUrl: '/assets/images/banner2.jpg'
            }
        ],
        activities: [
            {
                id: 1,
                title: '周末5人制足球友谊赛',
                coverImage: '/assets/images/activity1.jpg',
                time: '2024-02-24 14:00',
                location: '阳光体育场',
                price: 30,
                signupCount: 8,
                maxCount: 10
            },
            {
                id: 2,
                title: '11人制足球联赛',
                coverImage: '/assets/images/activity2.jpg',
                time: '2024-02-25 15:00',
                location: '星光足球场',
                price: 50,
                signupCount: 15,
                maxCount: 22
            }
        ],
        hasMore: true
    },

    onLoad() {
        this.getActivityList()
    },

    onPullDownRefresh() {
        this.getActivityList().then(() => {
            wx.stopPullDownRefresh()
        })
    },

    onReachBottom() {
        if (this.data.hasMore) {
            this.getActivityList(true)
        }
    },

    async getActivityList(loadMore = false) {
        try {
            const mockData = {
                activities: [
                    {
                        id: 3,
                        title: '新手友谊赛',
                        coverImage: '/assets/images/activity3.jpg',
                        time: '2024-02-26 16:00',
                        location: '青年体育场',
                        price: 20,
                        signupCount: 5,
                        maxCount: 10
                    }
                ],
                hasMore: false
            }

            this.setData({
                activities: loadMore ? [...this.data.activities, ...mockData.activities] : mockData.activities,
                hasMore: mockData.hasMore
            })
        } catch (error) {
            console.error('获取活动列表失败:', error)
            wx.showToast({
                title: '获取活动列表失败',
                icon: 'none'
            })
        }
    },

    onSearch(e) {
        const keyword = e.detail.value
        console.log('搜索关键词:', keyword)
    },

    onCreateActivity() {
        wx.navigateTo({
            url: '/pages/activity/create/index'
        })
    },

    onJoinActivity() {
        wx.switchTab({
            url: '/pages/activity/list/index'
        })
    },

    onMyActivities() {
        wx.switchTab({
            url: '/pages/user/index/index'
        })
    },

    onActivityTap(e) {
        const id = e.currentTarget.dataset.id
        wx.navigateTo({
            url: `/pages/activity/detail/index?id=${id}`
        })
    }
}) 
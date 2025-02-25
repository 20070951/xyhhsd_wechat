interface IPageData {
    activities: Array<{
        id: number;
        title: string;
        coverImage: string;
        time: string;
        location: string;
        price: number;
        signupCount: number;
        maxCount: number;
    }>;
    hasMore: boolean;
    currentFilter: 'all' | 'newest' | 'popular';
}

Page<IPageData>({
    data: {
        activities: [],
        hasMore: true,
        currentFilter: 'all'
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
            // TODO: 调用后端API获取活动列表
            // const res = await wx.cloud.callFunction({
            //   name: 'getActivityList',
            //   data: {
            //     filter: this.data.currentFilter,
            //     page: loadMore ? this.data.activities.length / 10 + 1 : 1
            //   }
            // })

            // 模拟数据
            const mockData = {
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

    onSearch(e: any) {
        const keyword = e.detail.value
        console.log('搜索关键词:', keyword)
        // TODO: 实现搜索功能
    },

    onFilterTap(e: any) {
        const type = e.currentTarget.dataset.type
        this.setData({
            currentFilter: type
        }, () => {
            this.getActivityList()
        })
    },

    onCreateActivity() {
        wx.navigateTo({
            url: '/pages/activity/create/index'
        })
    },

    onActivityTap(e: any) {
        const id = e.currentTarget.dataset.id
        wx.navigateTo({
            url: `/pages/activity/detail/index?id=${id}`
        })
    }
}) 
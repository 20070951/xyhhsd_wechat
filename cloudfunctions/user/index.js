// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
    const { action, data } = event
    const wxContext = cloud.getWXContext()
    const openid = wxContext.OPENID

    switch (action) {
        case 'getUserInfo':
            return getUserInfo(openid)
        case 'updateUserInfo':
            return updateUserInfo(openid, data)
        case 'getUserStats':
            return getUserStats(openid)
        default:
            return {
                code: -1,
                msg: '未知操作'
            }
    }
}

// 获取用户信息
async function getUserInfo(openid) {
    try {
        const user = await db.collection('users').doc(openid).get()
        return {
            code: 0,
            data: user.data
        }
    } catch (error) {
        if (error.errCode === -1) {
            // 用户不存在，返回空对象
            return {
                code: 0,
                data: {}
            }
        }
        return {
            code: -1,
            msg: '获取用户信息失败'
        }
    }
}

// 更新用户信息
async function updateUserInfo(openid, data) {
    try {
        await db.collection('users').doc(openid).set({
            data: {
                ...data,
                updateTime: db.serverDate()
            }
        })
        return {
            code: 0,
            msg: '更新成功'
        }
    } catch (error) {
        return {
            code: -1,
            msg: '更新用户信息失败'
        }
    }
}

// 获取用户统计数据
async function getUserStats(openid) {
    try {
        const [created, joined, collected] = await Promise.all([
            // 获取创建的活动数量
            db.collection('activities')
                .where({
                    _openid: openid
                })
                .count(),
            // 获取参与的活动数量
            db.collection('signups')
                .where({
                    _openid: openid
                })
                .count(),
            // 获取收藏的活动数量
            db.collection('collections')
                .where({
                    _openid: openid
                })
                .count()
        ])

        // 获取未读消息数量
        const unread = await db.collection('notifications')
            .where({
                toUser: openid,
                isRead: false
            })
            .count()

        return {
            code: 0,
            data: {
                createdCount: created.total,
                joinedCount: joined.total,
                collectedCount: collected.total,
                unreadCount: unread.total
            }
        }
    } catch (error) {
        return {
            code: -1,
            msg: '获取统计数据失败'
        }
    }
} 
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
        case 'createActivity':
            return createActivity(openid, data)
        case 'getActivityList':
            return getActivityList(data)
        case 'getActivityDetail':
            return getActivityDetail(data.id)
        case 'updateActivity':
            return updateActivity(openid, data)
        case 'deleteActivity':
            return deleteActivity(openid, data.id)
        case 'collectActivity':
            return collectActivity(openid, data.id)
        default:
            return {
                code: -1,
                msg: '未知操作'
            }
    }
}

// 创建活动
async function createActivity(openid, data) {
    try {
        const result = await db.collection('activities').add({
            data: {
                ...data,
                _openid: openid,
                signupCount: 0,
                createTime: db.serverDate(),
                updateTime: db.serverDate()
            }
        })

        return {
            code: 0,
            data: {
                id: result._id
            }
        }
    } catch (error) {
        return {
            code: -1,
            msg: '创建活动失败'
        }
    }
}

// 获取活动列表
async function getActivityList({ filter = 'all', page = 1, pageSize = 10 }) {
    try {
        let query = db.collection('activities')

        // 根据筛选条件设置查询条件
        switch (filter) {
            case 'newest':
                query = query.orderBy('createTime', 'desc')
                break
            case 'popular':
                query = query.orderBy('signupCount', 'desc')
                break
            default:
                query = query.orderBy('createTime', 'desc')
        }

        const [total, list] = await Promise.all([
            query.count(),
            query
                .skip((page - 1) * pageSize)
                .limit(pageSize)
                .get()
        ])

        return {
            code: 0,
            data: {
                total: total.total,
                list: list.data,
                hasMore: total.total > page * pageSize
            }
        }
    } catch (error) {
        return {
            code: -1,
            msg: '获取活动列表失败'
        }
    }
}

// 获取活动详情
async function getActivityDetail(id) {
    try {
        const activity = await db.collection('activities').doc(id).get()

        // 获取报名列表
        const signups = await db.collection('signups')
            .where({
                activityId: id
            })
            .orderBy('createTime', 'desc')
            .get()

        return {
            code: 0,
            data: {
                ...activity.data,
                signupList: signups.data
            }
        }
    } catch (error) {
        return {
            code: -1,
            msg: '获取活动详情失败'
        }
    }
}

// 更新活动
async function updateActivity(openid, data) {
    try {
        const activity = await db.collection('activities').doc(data.id).get()

        // 检查是否是活动创建者
        if (activity.data._openid !== openid) {
            return {
                code: -1,
                msg: '无权限修改'
            }
        }

        await db.collection('activities').doc(data.id).update({
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
            msg: '更新活动失败'
        }
    }
}

// 删除活动
async function deleteActivity(openid, id) {
    try {
        const activity = await db.collection('activities').doc(id).get()

        // 检查是否是活动创建者
        if (activity.data._openid !== openid) {
            return {
                code: -1,
                msg: '无权限删除'
            }
        }

        await db.collection('activities').doc(id).remove()

        return {
            code: 0,
            msg: '删除成功'
        }
    } catch (error) {
        return {
            code: -1,
            msg: '删除活动失败'
        }
    }
}

// 收藏/取消收藏活动
async function collectActivity(openid, activityId) {
    try {
        const collection = await db.collection('collections')
            .where({
                _openid: openid,
                activityId
            })
            .get()

        if (collection.data.length > 0) {
            // 已收藏，取消收藏
            await db.collection('collections').doc(collection.data[0]._id).remove()
            return {
                code: 0,
                data: {
                    isCollected: false
                }
            }
        } else {
            // 未收藏，添加收藏
            await db.collection('collections').add({
                data: {
                    _openid: openid,
                    activityId,
                    createTime: db.serverDate()
                }
            })
            return {
                code: 0,
                data: {
                    isCollected: true
                }
            }
        }
    } catch (error) {
        return {
            code: -1,
            msg: '操作失败'
        }
    }
} 
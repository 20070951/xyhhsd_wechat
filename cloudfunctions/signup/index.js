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
        case 'signup':
            return signup(openid, data)
        case 'cancelSignup':
            return cancelSignup(openid, data.id)
        case 'getSignupList':
            return getSignupList(data)
        case 'getMySignups':
            return getMySignups(openid, data)
        default:
            return {
                code: -1,
                msg: '未知操作'
            }
    }
}

// 报名活动
async function signup(openid, data) {
    try {
        // 检查活动是否存在
        const activity = await db.collection('activities').doc(data.activityId).get()
        if (!activity.data) {
            return {
                code: -1,
                msg: '活动不存在'
            }
        }

        // 检查是否已报名
        const existSignup = await db.collection('signups')
            .where({
                _openid: openid,
                activityId: data.activityId
            })
            .get()

        if (existSignup.data.length > 0) {
            return {
                code: -1,
                msg: '您已报名该活动'
            }
        }

        // 检查是否已满员
        if (activity.data.signupCount >= activity.data.maxCount) {
            return {
                code: -1,
                msg: '活动已满员'
            }
        }

        // 开始事务
        const transaction = await db.startTransaction()

        try {
            // 创建报名记录
            await transaction.collection('signups').add({
                data: {
                    _openid: openid,
                    activityId: data.activityId,
                    name: data.name,
                    phone: data.phone,
                    remark: data.remark,
                    status: 'pending', // pending, paid, cancelled
                    createTime: db.serverDate()
                }
            })

            // 更新活动报名人数
            await transaction.collection('activities').doc(data.activityId).update({
                data: {
                    signupCount: _.inc(1)
                }
            })

            // 提交事务
            await transaction.commit()

            return {
                code: 0,
                msg: '报名成功'
            }
        } catch (error) {
            // 回滚事务
            await transaction.rollback()
            throw error
        }
    } catch (error) {
        return {
            code: -1,
            msg: '报名失败'
        }
    }
}

// 取消报名
async function cancelSignup(openid, id) {
    try {
        // 检查报名记录是否存在
        const signup = await db.collection('signups').doc(id).get()
        if (!signup.data) {
            return {
                code: -1,
                msg: '报名记录不存在'
            }
        }

        // 检查是否是本人操作
        if (signup.data._openid !== openid) {
            return {
                code: -1,
                msg: '无权限操作'
            }
        }

        // 开始事务
        const transaction = await db.startTransaction()

        try {
            // 更新报名状态
            await transaction.collection('signups').doc(id).update({
                data: {
                    status: 'cancelled',
                    updateTime: db.serverDate()
                }
            })

            // 更新活动报名人数
            await transaction.collection('activities').doc(signup.data.activityId).update({
                data: {
                    signupCount: _.inc(-1)
                }
            })

            // 提交事务
            await transaction.commit()

            return {
                code: 0,
                msg: '取消成功'
            }
        } catch (error) {
            // 回滚事务
            await transaction.rollback()
            throw error
        }
    } catch (error) {
        return {
            code: -1,
            msg: '取消报名失败'
        }
    }
}

// 获取活动报名列表
async function getSignupList({ activityId, page = 1, pageSize = 10 }) {
    try {
        const query = db.collection('signups')
            .where({
                activityId,
                status: 'paid'
            })
            .orderBy('createTime', 'desc')

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
            msg: '获取报名列表失败'
        }
    }
}

// 获取我的报名列表
async function getMySignups(openid, { status = 'all', page = 1, pageSize = 10 }) {
    try {
        let query = db.collection('signups')
            .where({
                _openid: openid
            })

        // 根据状态筛选
        if (status !== 'all') {
            query = query.where({
                status
            })
        }

        query = query.orderBy('createTime', 'desc')

        const [total, list] = await Promise.all([
            query.count(),
            query
                .skip((page - 1) * pageSize)
                .limit(pageSize)
                .get()
        ])

        // 获取活动详情
        const activities = await Promise.all(
            list.data.map(item =>
                db.collection('activities').doc(item.activityId).get()
            )
        )

        const signupList = list.data.map((item, index) => ({
            ...item,
            activity: activities[index].data
        }))

        return {
            code: 0,
            data: {
                total: total.total,
                list: signupList,
                hasMore: total.total > page * pageSize
            }
        }
    } catch (error) {
        return {
            code: -1,
            msg: '获取报名列表失败'
        }
    }
} 
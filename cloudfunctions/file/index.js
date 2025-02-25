// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
    const { action, data } = event
    const wxContext = cloud.getWXContext()
    const openid = wxContext.OPENID

    switch (action) {
        case 'getUploadToken':
            return getUploadToken(data)
        case 'deleteFile':
            return deleteFile(data.fileID)
        default:
            return {
                code: -1,
                msg: '未知操作'
            }
    }
}

// 获取上传凭证
async function getUploadToken(data) {
    try {
        const path = `${data.type}/${Date.now()}-${Math.random().toString(36).substr(2)}.${data.ext}`
        const result = await cloud.uploadFile({
            cloudPath: path,
            fileContent: data.buffer,
        })

        return {
            code: 0,
            data: {
                fileID: result.fileID,
                path
            }
        }
    } catch (error) {
        return {
            code: -1,
            msg: '获取上传凭证失败'
        }
    }
}

// 删除文件
async function deleteFile(fileID) {
    try {
        await cloud.deleteFile({
            fileList: [fileID]
        })

        return {
            code: 0,
            msg: '删除成功'
        }
    } catch (error) {
        return {
            code: -1,
            msg: '删除文件失败'
        }
    }
} 
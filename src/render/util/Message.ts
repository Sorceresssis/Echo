import { ElMessage } from 'element-plus'

class Message {
    private static readonly duration = 1000

    public static success(message: string, duration?: number) {
        ElMessage.closeAll()
        ElMessage.success({
            message: message,
            duration: duration || this.duration,
        })
    }

    public static error(message: string, duration?: number) {
        ElMessage.closeAll()
        ElMessage.error({
            message: message,
            duration: duration || this.duration,
        })
    }

    public static warning(message: string, duration?: number) {
        ElMessage.closeAll()
        ElMessage.warning({
            message: message,
            duration: duration || this.duration,
        })
    }

    public static info(message: string, duration?: number) {
        ElMessage.closeAll()
        ElMessage.info({
            message: message,
            duration: duration || this.duration,
        })
    }
}

export default Message 
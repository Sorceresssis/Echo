import { ElMessage } from 'element-plus'

class Message {
    private static readonly duration = 1000

    public static success(message: string) {
        ElMessage.closeAll()
        ElMessage.success({
            message: message,
            duration: this.duration,
        })
    }

    public static error(message: string) {
        ElMessage.closeAll()
        ElMessage.error({
            message: message,
            duration: this.duration,
        })
    }

    public static warning(message: string) {
        ElMessage.closeAll()
        ElMessage.warning({
            message: message,
            duration: this.duration,
        })
    }

    public static info(message: string) {
        ElMessage.closeAll()
        ElMessage.info({
            message: message,
            duration: this.duration,
        })
    }
}

export default Message 
import { ElMessageBox, type MessageBoxData } from 'element-plus'

type MessageBoxType = 'error' | 'info' | 'success' | 'warning'

class MessageBox {
    /**  
     * @param options ElMessageBoxOptions,但是不包含type,confirmButtonText,cancelButtonText 参考element-plus官方文档
     */
    public static confirm(
        title: string,
        message: string,
        type: MessageBoxType = 'info',
        confirmButtonText: string = '确定',
        cancelButtonText: string = '取消',
        options?: { [key: string]: any; type?: never; confirmButtonText?: never; cancelButtonText?: never }
    ): Promise<MessageBoxData> {
        return ElMessageBox.confirm(
            message,
            title,
            {
                type: type,
                confirmButtonText: confirmButtonText,
                cancelButtonText: cancelButtonText,
                ...options
            }
        )
    }

    public static deleteConfirm(): Promise<MessageBoxData> {
        return this.confirm('危险操作', '你确定要删除吗?删除后无法恢复!', 'warning', '删除')
    }

    public static addConfirm(): Promise<MessageBoxData> {
        return this.confirm('确认操作', '你确定要添加吗?', 'warning', '添加')
    }

    public static editConfirm(): Promise<MessageBoxData> {
        return this.confirm('危险操作', '你确定要修改吗?', 'warning', '修改')
    }

    public static editPrompt(inputValue: string): Promise<MessageBoxData> {
        return ElMessageBox.prompt(
            '请输入新值', '编辑', {
            confirmButtonText: '完成',
            cancelButtonText: '取消',
            inputPattern: /\S/,
            inputErrorMessage: '输入值不能为空',
            inputValue: inputValue || '',
        })
    }
}


export default MessageBox
import { ElMessageBox } from 'element-plus'

class MessageBox {
    public static confirm(
        cb: () => void,
        title: string,
        message: string,
        type: 'error' | 'info' | 'success' | 'warning' = 'info',
        confirmButtonText: string = '确定',
        cancelButtonText: string = '取消',
    ): void {
        ElMessageBox.confirm(
            message,
            title,
            {
                confirmButtonText: confirmButtonText,
                cancelButtonText: cancelButtonText,
                type: type,
            }
        ).then(cb).catch()
    }

    public static deleteConfirm(cb: () => void): void {
        MessageBox.confirm(cb, '危险操作', '你确定要删除吗?删除后无法恢复!', 'warning', '删除')
    }

    public static addConfirm(cb: () => void): void {
        MessageBox.confirm(cb, '确认操作', '你确定要添加吗?', 'warning', '添加')
    }

    public static editConfirm(cb: () => void): void {
        MessageBox.confirm(cb, '危险操作', '你确定要修改吗?', 'warning', '修改')
    }

    public static editPrompt(cb: (value: string) => void, oldValue?: string): void {
        ElMessageBox.prompt('请输入新值', '编辑', {
            confirmButtonText: '完成',
            cancelButtonText: '取消',
            inputErrorMessage: '输入错误',
            inputValue: oldValue || '',
        }).then(({ value }) => {
            MessageBox.editConfirm(() => { cb(value) })
        }).catch()
    }
}

export const deleteConfirm = (cb: () => void): void => {
    ElMessageBox.confirm(
        '你确定要删除吗？删除后无法恢复！',
        '危险操作',
        {
            confirmButtonText: '删除',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(cb).catch(() => {
    })
}

export const addConfirm = (cb: () => void): void => {
    ElMessageBox.confirm(
        '你确定要添加吗？',
        '确认操作',
        {
            confirmButtonText: '添加',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(cb).catch(() => {
    })
}

export const editConfirm = (cb: () => void): void => {
    ElMessageBox.confirm(
        '你确定要修改吗？',
        '确认操作',
        {
            confirmButtonText: '修改',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(cb).catch(() => {
    })
}
export default MessageBox
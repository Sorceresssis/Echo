import { ElMessageBox } from 'element-plus'

export const deleteConfirm = (cb: () => void): void => {
  ElMessageBox.confirm(
    '你确定要删除吗？删除后无法恢复！',
    '危险操作',
    {
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(cb).catch(() => { })
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
  ).then(cb).catch(() => { })
}

export const editConfirm = (cb: () => void): void => {
  ElMessageBox.confirm(
    '你确定要保存吗？',
    '确认操作',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(cb).catch(() => { })
}

export const editPrompt = (cb: (value: string) => void, oldValue?: string): void => {
  ElMessageBox.prompt('请输入新值', '编辑', {
    confirmButtonText: '修改',
    cancelButtonText: '取消',
    inputErrorMessage: '输入错误',
    inputValue: oldValue || '',
  }).then(({ value }) => {
    cb(value)
  }).catch(() => { })
}

export default { deleteConfirm }
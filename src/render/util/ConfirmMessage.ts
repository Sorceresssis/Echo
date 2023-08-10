import { ElMessageBox } from 'element-plus'

export const deleteClickConfirm = (cb: () => void): void => {
  ElMessageBox.confirm(
    'proxy will permanently delete the file. Continue?',
    'Warning',
    {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'warning',
    }
  ).then(cb)
}

export default { deleteClickConfirm }
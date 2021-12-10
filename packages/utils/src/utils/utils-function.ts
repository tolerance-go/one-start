export function getUser(): Record<string, any> | null {
  try {
    // @todo 内容加密，防止篡改
    const userStr = localStorage.getItem('tongyu_USER_LOCAL_FIELD');
    const user = userStr && JSON.parse(userStr);
    return user;
  } catch {
    return null;
  }
}

export function getToken() {
  const { token } = (getUser() || {}) as any;
  return token;
}

// 导出excel文件流
export const exportExcelFileStream = ({
  fileName = '导出文件名',
  fileExtension = 'xlsx',
  file = '',
} = {}) => {
  if (!file) {
    return;
  }
  const aLink = document.createElement('a');
  aLink.download = `${fileName}.${fileExtension}`;
  const byteCharacters = window.atob(file);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i += 1) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new window.Blob([byteArray], { type: 'application/octet-stream' });
  aLink.href = window.URL.createObjectURL(blob);
  aLink.click();
  window.URL.revokeObjectURL(blob as any);
};

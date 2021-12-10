export const exportWebExcel = (options: {
  fileName: string;
  file: BlobPart;
  /**
   * char-stream 字符流
   * byte-stream 字节流
   * file-stream 文件流
   */
  fileType?: 'char-stream' | 'byte-stream' | 'file-stream';
}) => {
  const { fileType = 'file-stream', fileName, file } = options;

  const getBlobPart = () => {
    if (fileType === 'char-stream') {
      const byteCharacters = window.atob(file as string);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i += 1) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      return byteArray;
    }
    return file;
  };

  const downloadLink = document.createElement('a');
  downloadLink.download = fileName;
  downloadLink.style.display = 'none';
  const blob = new Blob([getBlobPart()]);
  downloadLink.href = URL.createObjectURL(blob);
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
};

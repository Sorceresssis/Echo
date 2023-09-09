import Segment from 'segment'


// 创建实例
const segment = new Segment()
// 使用默认的识别模块及字典，载入字典文件需要1秒，仅初始化时执行一次即可
segment.useDefault()
// 测试发现，当字符特别长时，会卡住程序为了性能的考虑截取前面的100个字符
const maxLen = 80

// 开始分词
const tokenizer = (text: string): string[] => {
    if (text.length > maxLen) {
        text = text.substring(0, maxLen)
    }
    return [...new Set(
        segment.doSegment(text, {
            simple: true, // 不返回词性
            stripPunctuation: true // 去除标点符号
        })
    )]
}

export default tokenizer;
import Segment from 'segment'


// 创建实例
const segment = new Segment();
// 使用默认的识别模块及字典，载入字典文件需要1秒，仅初始化时执行一次即可
segment.useDefault();

// 开始分词
const tokenizer = (text: string): string[] => {
    return segment.doSegment(text, {
        simple: true, // 不返回词性
        stripPunctuation: true // 去除标点符号
    })
}

export default tokenizer;
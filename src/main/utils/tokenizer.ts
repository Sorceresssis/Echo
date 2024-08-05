import Segment from 'segment'

const segment = new Segment()

// 使用默认的识别模块及字典，载入字典文件需要1秒，仅初始化时执行一次即可
segment.useDefault()

const tokenizer = (text: string): string[] => {
    // 把括号替换成空格, 分词器有时无法把括号过滤掉
    // 把大块的文本分割成小块, 每块30个字符, 以防止分词器卡死
    text = text.replace(/\(|\)/g, ' ').replace(/(\S{30})(?=\S)/g, '$1 ')

    const segments = segment.doSegment(text, {
        simple: true, // 不返回词性
        stripPunctuation: true // 去除标点符号
    })

    return Array.from(new Set(segments))
}

export default tokenizer;
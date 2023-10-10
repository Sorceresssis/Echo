import Segment from 'segment'

const segment = new Segment()

// 使用默认的识别模块及字典，载入字典文件需要1秒，仅初始化时执行一次即可
segment.useDefault()

const tokenizer = (text: string, segmentsCount: number): string[] => {
    // 把括号替换成空格, 分词器有时无法把括号过滤掉
    // 把大块的文本分割成小块, 每块15个字符, 以防止分词器卡死
    text = text.replace(/\(|\)/g, ' ').replace(/(\S{15})(?=\S)/g, '$1 ')

    const segments = segment.doSegment(text, {
        simple: true, // 不返回词性
        stripPunctuation: true // 去除标点符号
    })

    const segmentSet = new Set(segments.slice(0, segmentsCount))
    for (let i = segmentsCount; i < segments.length && segmentSet.size < segmentsCount; i++) {
        segmentSet.add(segments[i])
    }

    return Array.from(segmentSet)
}

export default tokenizer;
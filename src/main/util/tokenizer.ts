import Segment from 'segment'


// 创建实例
const tokenizer = new Segment();
// 使用默认的识别模块及字典，载入字典文件需要1秒，仅初始化时执行一次即可
tokenizer.useDefault();

// 开始分词
console.log(tokenizer.doSegment('这是一个基于Node.js的中文分词模块。'));


export default tokenizer;

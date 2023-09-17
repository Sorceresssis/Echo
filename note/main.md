# 数据库

在处理数据库数据时要考虑结果的大小，如果数据量太大，应该会出错。

# node Path模块

## resolve, join, normalize 比较

### 1. 对windows盘符的处理

> 1. C
> 2. C:
> 3. C:.
> 4. C:\

resolve 会把C:，C:\，C:.都解析成C:\

join 和 normalize 结果一样， 解析分别为E，E:.，E:.，E:\

### 2.对分隔符的处理

> C:\
>
> C:\user\
>
> C:\user

path.resolve() 不会保留最外部的分隔符

path.normalize() 会保留最外的分隔符

### 结论

对要保存的路径做resolve处理, 因为盘符处理是一致的，路径统一去除最外的分隔符

对路径截取操作适合使用normlize，对分隔符的保留使得路径比对更方便。

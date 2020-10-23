# 线性代数库

该库基于 [ATLAS](http://math-atlas.sourceforge.net/) 和 [BLAS/LAPACK](http://www.netlib.org/lapack) 开发;

blas包中存在2个方法：Matrix，ComplexMatrix ，它们以单精度和双精度表示实数和复数矩阵。
用于求解方程式或计算特征值的高级例程归类为“本征Eigen”，“求解Solve”或“几何Geometry”之类。

要构造新矩阵，可以使用函数，也可以使用特定方法之一（构造一个全为1的矩阵），zeros 全零矩阵，rand（条目在0和1之间均匀分布），randn（条目在正态分布），eye （单位矩阵），diag（具有给定对角线的矩阵）。尺寸按“行”，“列”的顺序指定。如果省略，则列数默认为1（意味着，如果仅提供一个维，则将构造行向量）。

要访问元素，请使用put和get。还存在用于读取或写入整个列，行或子矩阵的方法。

每个数学运算符都映射到一个简短的助记符名称。例如，+变为 add，–变为 sub，*变为 mul，/变为 div，依此类推。
通常，您可以传递一个double或float值，或者传递一个仅包含一个元素的矩阵作为方法的参数，例如，将相同的值添加到矩阵的所有元素中。
mul是逐元素乘法。矩阵矩阵乘法称为mmul。
通常，您可以在方法中添加“ i”以使其“就地”工作。例如，addi类似于 +=。

double 表示 js 中的浮点数, int 表示整数.



# 引入

```javascript
var blas = require("blas");
```


# 方法

## Complex complex(double real [, double imag])

创建一个复数对象, real - 实数部分, imag - 虚数部分(默认为 0).


## ComplexMatrix complexMatrix([double row [, double column]])

创建一个复数二维矩阵对象, row 行 column 列;
无参调用, 创建 0 行 0 列矩阵; 只提供 row 则创建 row 行 1 列矩阵;
元素值都为 0.


## ComplexMatrix complexMatrixd(double[] data)

创建并初始化一个行向量, 向量长度为 data 长度的一半, 偶数索引是实部, 奇数索引为虚部;


## ComplexMatrix complexMatrix(double[][] data)

创建并初始化一个 ComplexMatrix, data 作为矩阵元素的实数部分, 所有虚数为 0;


## ComplexMatrix complexMatrixc(Complex[] data)

创建并初始化长度为 data 长度的行向量;


## ComplexMatrix complexMatrix(Matrix real [, Matrix imag])

创建并初始化一个 ComplexMatrix, real 作为矩阵元素的实数部分, imag 为虚数;
未设置 imag 参数则虚数为 0;


## ComplexMatrix complexMatrixOnes(int rows [, int column])

创建并初始化一个单位矩阵;


## ComplexMatrix complexMatrixDiag(ComplexMatrix m [, int row, int col])

创建并用 m 的对角线初始化一个矩阵, row / col 未设置则等于 m 的行列.


## ComplexMatrix concatHorizontally(ComplexMatrix a, ComplexMatrix b)

水平连接两个矩阵, 并返回创建的新矩阵;
连接后的矩阵列为 a 与 b 的总和, 行不变;
a 与 b 的行数必须相同, 否则抛出异常.


## ComplexMatrix concatVertically(ComplexMatrix a, ComplexMatrix b)

垂直连接两个矩阵, 并返回创建的新矩阵;
连接后的矩阵行为 a 与 b 的总和, 列不变;
a 与 b 的列数必须相同, 否则抛出异常.


## Matrix matrixd(double[] d)

创建并初始化一个行向量.


## Matrix matrix(double[][] d)

创建并初始化一个矩阵.


## Matrix matrix(int row [, int column])

创建并初始化一个矩阵, row 行, column 列, 省略 column 参数时为 1.
元素值都为 0.


## Matrix matrixRand(int row [, int column])

创建并用随机数初始化矩阵, row 行, column 列, 省略 column 参数时为 1.
随机数在0和1之间均匀分布.


## Matrix matrixRand(int row [, int column])

创建并用随机数初始化矩阵, row 行, column 列, 省略 column 参数时为 1.
随机数在0和1之间正态分布.


## Matrix matrixOnes(int row [, int column])

创建并 1 初始化矩阵, row 行, column 列, 省略 column 参数时为 1.


## Matrix matrixEye(int n)

创建 n * n 单位矩阵.


## Matrix matrixDiag(Matrix m [, int row, int col])

创建并用 m 的对角线初始化一个矩阵, row / col 未设置则等于 m 的行列.


## Matrix matrixLinspace(int lower, int upper, int size)

构造一个列向量，其元素是从 lower 到 upper 性间隔的点，向量长度为 size.


## Matrix matrixLogspace(double lower, double upper, int size)

构造一个列向量，其元素是从 10^lower 到 10^upper 性间隔的点，向量长度为 size.


# 属性 eigen

特征值和特征向量相关函数。

存在用于处理对称矩阵或一般特征值的方法。 在对称矩阵上，对称版本通常要快得多。

调用方法: 

```javascript
blas.eigen.eigenvalues(...)
```


# 属性 geometry

# 属性 solve

# 属性 singular

# 属性 mf (Matrix Function)


# 类

## Complex

复数类

### double real()

返回实数部分

### double imag()

返回虚数部分

### Complex dup()

复制当前值并返回

### Complex copy(Complex other)

复制 other 到 this, 返回 other

### Complex set(double real, double imag)

设置当前实例的值, 返回 this

### Complex addi(Complex c, Complex result)

复数加法; result = this + c; 返回 result

### Complex addi(Complex c)

复数加法; this = this + c; 返回 this

### Complex add(Complex c)

复数加法; result = this + c; 返回 result

### Complex addi(double a, Complex result)

复数与实数加法; result = this + a; 返回 result

### Complex addi(double c)

复数与实数加法; this = this + c; 返回 this

### Complex add(double c)

复数与实数加法; result = this + c; 返回 result

### Complex subi(Complex c, Complex result)

复数减法; result = this - c; 返回 result

### Complex subi(Complex c)

复数减法

### Complex sub(Complex c)

复数减法

### Complex subi(double a, Complex result)

复数与实数减法

### Complex subi(double a)

复数与实数减法

### Complex sub(double r)

复数与实数减法

### Complex muli(Complex c, Complex result)

复数乘法

### Complex muli(Complex c)

复数乘法

### Complex mul(Complex c)

复数乘法

### Complex mul(double v)

复数与实数乘法

### Complex muli(double v, Complex result)

复数与实数乘法

### Complex muli(double v)

复数与实数乘法

### Complex div(Complex c)

复数除法; result = this / c; 返回 result

### Complex divi(Complex c, Complex result)

复数除法

### Complex divi(Complex c)

复数除法

### Complex divi(double v, Complex result)

复数与实数除法

### Complex divi(double v)

复数与实数除法

### Complex div(double v)

复数与实数除法

### double abs()

返回复数的模

### double arg()

返回复数的辐角

### Complex invi()

在 this 上执行 inv 并修改 this

### Complex inv()

返回 this / (r ^2 + i ^2)

### Complex neg()

符号取反

### Complex negi()

符号取反, 修改 this

### Complex conj()

虚部取反

### Complex conji()

虚部取反, 修改 this

### Complex sqrt()

复数开方

### boolean eq(Complex c)

this 与 c 相等返回 true

### boolean ne(Complex c)

this 与 c 不等返回 true

### boolean isZero()

实部与虚部都为零返回 true

### boolean isReal()

实部为零返回 true

### boolean isImag()

虚部为零返回 true


## ComplexMatrix

复数二维矩阵类

### boolean isScalar()

矩阵是 1x1 标量返回 true

### Complex scalar()

返回标量的值

### ComplexMatrix get(int[] indices)

创建并返回 indices.length 行 1 列的矩阵, 元素复制自 indices 索引当前矩阵中的值.
如索引 2 行 3列中的元素, 索引等于 6.

### ComplexMatrix get(int r, int[] indices)

indices 中的索引从 r 行开始计算

### ComplexMatrix get(int[] indices, int c)

indices 中的索引从 c 列开始计算

### ComplexMatrix get(int[] rindices, int[] cindices)

创建并返回 rindices.length 行 cindices.length 列的矩阵,
元素复制自 rindices/cindices 索引当前矩阵中的值.

### ComplexMatrix get(ComplexMatrix indices)

创建并返回和 indices 同样大的矩阵, 元素复制自 indices 索引当前矩阵中的值.

### Complex get(int i)

返回元素, i = 行 x 列

### Complex get(int rowIndex,  int columnIndex)

返回元素

### ComplexMatrix put(int[] indices, ComplexMatrix x)

修改并返回 this; this[indices[n]] = x[n]; n = 0 ... indices.length

### ComplexMatrix put(int r, int[] indices, ComplexMatrix x)

修改并返回 this; this[r, indices[n]] = x[n]; n = 0 ... indices.length

### ComplexMatrix put(int[] indices, int c, ComplexMatrix x)

修改并返回 this; this[indices[n], c] = x[n]; n = 0 ... indices.length

### ComplexMatrix put(int[] rindices, int[] cindices, ComplexMatrix x)

修改并返回 this; this[rindices[r], cindices[c]] = x[r, c]; 
r = 0 ... rindices.length; c = 0 ... cindices.length;

### ComplexMatrix put(int[] indices, double v)

修改并返回 this, 只修改实数部分; this[indices[n]] = v; n = 0 ... indices.length

### ComplexMatrix putReal(int[] indices, double v)

修改并返回 this, 只修改实数部分; this[indices[n]] = v; n = 0 ... indices.length

### ComplexMatrix putImag(int[] indices, double v)

修改并返回 this, 只修改虚数部分; this[indices[n]] = v; n = 0 ... indices.length

### ComplexMatrix put(int[] indices, Complex v)

修改并返回 this; this[indices[n]] = v; n = 0 ... indices.length

### ComplexMatrix put(int rowIndex, int columnIndex, Complex value)

修改并返回 this; this[rowIndex, columnIndex] = value

### ComplexMatrix putReal(int rowIndex, int columnIndex, double value)

修改并返回 this, 只修改实数部分; this[rowIndex, columnIndex] = value

### ComplexMatrix putImag(int rowIndex, int columnIndex, double value)

修改并返回 this, 只修改虚数部分; this[rowIndex, columnIndex] = value
 
### int getColumns()

返回列数

### int getRows()

返回行数

### int getLength()

返回数据总长

### boolean isEmpty()

是空矩阵返回 true

### boolean isSquare()

是方阵返回 true

### void assertSquare()

如果不是方阵, 抛出异常

### boolean isVector()

是向量返回 true; 

### boolean isRowVector()

### boolean isColumnVector()

### ComplexMatrix diag()

创建并返回当前矩阵的对角线矩阵

### Matrix real()

用当前矩阵的实部创建一个矩阵并返回

### Matrix imag()
 
用当前矩阵的虚部创建一个矩阵并返回

### double[] toDoubleArray()

### Complex[] toArray()


### ComplexMatrix add(ComplexMatrix v)

矩阵元素加法; result = this + v; 返回 result
没有 i 后缀表示不改变 this

### ComplexMatrix add(Complex v)

矩阵元素与标量加法; result = this + v; 返回 result

### ComplexMatrix add(double v)

矩阵元素与标量加法; result = this + v; 返回 result


### ComplexMatrix addi(ComplexMatrix other [, ComplexMatrix result])

矩阵元素加法; result = this + other; 返回 result
如果 result 省略, 则为 this, 后面相同.
 
### ComplexMatrix addi(Complex v [, ComplexMatrix result])

矩阵元素与标量加法; result = this + v; 返回 result

### ComplexMatrix addi(double v [, ComplexMatrix result])

矩阵元素与标量(虚数为零)加法; result = this + v; 返回 result


### ComplexMatrix sub(ComplexMatrix other)

矩阵元素减法; result = this - other; 返回 result

### ComplexMatrix sub(Complex v)

矩阵元素与标量减法; result = this - v; 返回 result

### ComplexMatrix sub(double v)

矩阵元素与标量(虚数为零)减法; result = this - v; 返回 result


### ComplexMatrix subi(ComplexMatrix other [, ComplexMatrix result])

矩阵元素减法; result = this - other; 返回 result

### ComplexMatrix subi(Complex v [, ComplexMatrix result])

矩阵元素与标量减法; result = this - v; 返回 result

### ComplexMatrix subi(double v [, ComplexMatrix result])

矩阵元素与标量(虚数为零)减法; result = this - v; 返回 result


### ComplexMatrix rsub(ComplexMatrix other)

矩阵元素减法; result = other - this; 返回 result

### ComplexMatrix rsub(Complex a)

矩阵元素与标量减法; result = a - this; 返回 result

### ComplexMatrix rsub(double a)

矩阵元素与标量量(虚数为零)减法; result = a - this; 返回 result


### ComplexMatrix rsubi(ComplexMatrix other [, ComplexMatrix result])

矩阵元素减法; result = other - this; 返回 result

### ComplexMatrix rsubi(Complex a [, ComplexMatrix result])

矩阵元素与标量减法; result = a - this; 返回 result

### ComplexMatrix rsubi(double a [, ComplexMatrix result])

矩阵元素与标量量(虚数为零)减法; result = a - this; 返回 result


### ComplexMatrix mul(ComplexMatrix other)

矩阵元素乘法; result = this * other; 返回 result

### ComplexMatrix mul(Complex v)

矩阵元素与标量乘法; result = this * v; 返回 result

### ComplexMatrix mul(double v)

矩阵元素与标量(虚数为零)乘法; result = this * v; 返回 result


### ComplexMatrix muli(ComplexMatrix other [, ComplexMatrix result])

矩阵元素乘法; result = this * other; 返回 result

### ComplexMatrix muli(Complex v [, ComplexMatrix result])

矩阵元素与标量乘法; result = this * v; 返回 result

### ComplexMatrix muli(double v [, ComplexMatrix result])

矩阵元素与标量(虚数为零)乘法; result = this * v; 返回 result


### ComplexMatrix mmul(ComplexMatrix other)

矩阵乘法; result = this * other; 返回 result

### ComplexMatrix mmuli(ComplexMatrix other [, ComplexMatrix result])

矩阵乘法; result = this * other; 返回 result


### ComplexMatrix div(ComplexMatrix other)

矩阵元素除法; result = this / other; 返回 result

### ComplexMatrix div(Complex a)

矩阵元素与标量除法; result = this / a; 返回 result

### ComplexMatrix div(double a)

矩阵元素与标量(虚数为零)除法; result = this / a; 返回 result


### ComplexMatrix divi(ComplexMatrix other [, ComplexMatrix result])

矩阵元素除法; result = this / other; 返回 result

### ComplexMatrix divi(Complex a [, ComplexMatrix result])

矩阵元素与标量除法; result = this / a; 返回 result

### ComplexMatrix divi(double a [, ComplexMatrix result])

矩阵元素与标量(虚数为零)除法; result = this / a; 返回 result


### ComplexMatrix rdiv(ComplexMatrix other)

矩阵元素除法; result = other / this; 返回 result

### ComplexMatrix rdiv(Complex a)

矩阵元素与标量除法; result = a / this; 返回 result

### ComplexMatrix rdiv(double a)

矩阵元素与标量(虚数为零)除法; result = a / this; 返回 result


### ComplexMatrix rdivi(ComplexMatrix other [, ComplexMatrix result])

矩阵元素除法; result = other / this; 返回 result

### ComplexMatrix rdivi(Complex a [, ComplexMatrix result])

矩阵元素与标量除法; result = a / this; 返回 result

### ComplexMatrix rdivi(double a [, ComplexMatrix result])

矩阵元素与标量(虚数为零)除法; result = a / this; 返回 result


### ComplexMatrix neg()

返回一个当前矩阵的拷贝, 值是当前矩阵值符号取反.

### ComplexMatrix negi()

在当前矩阵上执行 neg().

### ComplexMatrix not()

返回一个当前矩阵的拷贝, 值是当前矩阵值逐元素取反, 如果元素值是 0 则结果为 1 否则结果为 0.

### ComplexMatrix noti()

在当前矩阵上执行 not().

### ComplexMatrix truthi()

返回一个当前矩阵的拷贝, 值是当前矩阵值逐元素取反, 如果元素值是 0 则结果为 0 否则结果为 1.

### ComplexMatrix truth()

在当前矩阵上执行 truthi().

### ComplexMatrix rankOneUpdate(Complex alpha, ComplexMatrix x, ComplexMatrix y)

this = this + alpha * x * y'; 返回 this

### ComplexMatrix rankOneUpdate(double alpha, ComplexMatrix x, ComplexMatrix y)

this = this + alpha * x * y'; 返回 this

### ComplexMatrix rankOneUpdate(double alpha, ComplexMatrix x)

this = this + alpha * x * x'

### ComplexMatrix rankOneUpdate(Complex alpha, ComplexMatrix x)

this = this + alpha * x * x'

### ComplexMatrix rankOneUpdate(ComplexMatrix x)

this = this + x * x'

### ComplexMatrix rankOneUpdate(ComplexMatrix x, ComplexMatrix y)

this = this + x * y'

### Complex sum()

返回所有元素的和

### Complex mean()

返回所有元素的平均值

### Complex dotc(ComplexMatrix other)

计算向量 this 与向量 other 的复共轭的点积.
this 和 other 作为向量使用.

### Complex dotu(ComplexMatrix other)

计算向量 this 与向量 other 的点积.
this 和 other 作为向量使用.

### double norm1()

计算向量中元素的实部和虚部的绝对值之和

### double norm2()

计算向量的欧几里德长度，并按比例缩放输入以避免破坏性下溢和溢出

### double normmax()

返回矢量元素的实部和虚部的绝对值之和最大的矢量元素的值

### ComplexMatrix columnSums()

创建和当前矩阵相同列数的列向量, 将每行的总和作为列值, 返回创建的列向量.

### ComplexMatrix columnMeans()
 
创建和当前矩阵相同列数的列向量, 将每行的平均值作为列值, 返回创建的列向量.

### ComplexMatrix rowSums()

创建和当前矩阵相同列数的行向量, 将每列的总和作为行值, 返回创建的行向量.

### ComplexMatrix rowMeans()

创建和当前矩阵相同列数的行向量, 将每列的平均值作为行值, 返回创建的行向量.

### ComplexMatrix getColumn(int c)

返回当前矩阵 c 列的副本

### void putColumn(int c, ComplexMatrix v)

设置 c 列的值.

### ComplexMatrix getRow(int r)

返回当前矩阵 r 行的副本

### void putRow(int r, ComplexMatrix v)

设置 r 行的值.

### void addRowVector(ComplexMatrix x)

矩阵中的每一行与 x 做加法, 并原地保存.
x 应为行向量.

### void addColumnVector(ComplexMatrix x)

矩阵中的每一列与 x 做加法, 并原地保存.
x 应为列向量.

### void subRowVector(ComplexMatrix x)

矩阵中的每一行与 x 做减法, 并原地保存.
x 应为行向量.

### void subColumnVector(ComplexMatrix x)

矩阵中的每一列与 x 做减法, 并原地保存.
x 应为列向量.

### ComplexMatrix eqi(ComplexMatrix other [, ComplexMatrix result])

矩阵 this 与 other 逐元素比较, 相等结果为 1 否则为 0, 将结果保存在 result 矩阵中.
省略 result 则结果保存在 this 中, 返回 result.

### ComplexMatrix eqi(Complex value [, ComplexMatrix result])

### ComplexMatrix eqi(double value [, ComplexMatrix result])


### ComplexMatrix eq(ComplexMatrix other)

矩阵 this 与 other 逐元素比较, 相等结果为 1 否则为 0, 将结果保存在 this 矩阵中.

### ComplexMatrix eq(Complex value)

### ComplexMatrix eq(double value)


### ComplexMatrix nei(ComplexMatrix other [, ComplexMatrix result])

结果与 eq 相反, 不相等为 1.

### ComplexMatrix nei(Complex value [, ComplexMatrix result])

### ComplexMatrix nei(double value [, ComplexMatrix result])

### ComplexMatrix ne(ComplexMatrix other)

### ComplexMatrix ne(Complex value)

### ComplexMatrix ne(double value)


### ComplexMatrix andi(ComplexMatrix other [, ComplexMatrix result])

矩阵 this 与 other 逐元素比较, 都不为 0 值结果为 1 否则为 0, 将结果保存在 result 矩阵中.
省略 result 则结果保存在 this 中, 返回 result.

### ComplexMatrix andi(Complex value [, ComplexMatrix result])

### ComplexMatrix andi(double value [, ComplexMatrix result])

### ComplexMatrix and(ComplexMatrix other)

### ComplexMatrix and(Complex value)

### ComplexMatrix and(double value)


### ComplexMatrix ori(ComplexMatrix other [, ComplexMatrix result])

矩阵 this 与 other 逐元素比较, 任意值为 1 则结果为 1 否则为 0, 将结果保存在 result 矩阵中.
省略 result 则结果保存在 this 中, 返回 result.

### ComplexMatrix ori(Complex value [, ComplexMatrix result])

### ComplexMatrix ori(double value [, ComplexMatrix result])

### ComplexMatrix or(ComplexMatrix other)

### ComplexMatrix or(Complex value)

### ComplexMatrix or(double value)


### ComplexMatrix xori(ComplexMatrix other [, ComplexMatrix result])

矩阵 this 与 other 逐元素比较, 同时为零或同时非零则结果为 0 否则为 1, 将结果保存在 result 矩阵中.
省略 result 则结果保存在 this 中, 返回 result.

### ComplexMatrix xori(Complex value [, ComplexMatrix result])

### ComplexMatrix xori(double value [, ComplexMatrix result])

### ComplexMatrix xor(ComplexMatrix other)

### ComplexMatrix xor(Complex value)

### ComplexMatrix xor(double value)


## Matrix

实数二维矩阵类
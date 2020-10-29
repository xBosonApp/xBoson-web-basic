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


## 目录

* [模块方法](#ModuleFunctions)
* 类
  * [复数](#complex)
  * [实数矩阵](#matrix)
  * [复数矩阵](#ComplexMatrix)
  * [范围](#range)
* 子算法模块
  * [特征值](#eigen)
  * [几何](#geometry)
  * [线性方程](#solve)
  * [奇异值](#singular)
  * [矩阵](#mf)


# 引入

```javascript
var blas = require("blas");
```


# 方法 `anchor=ModuleFunctions`


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


## Matrix concatHorizontally(Matrix a, Matrix b)

水平连接两个矩阵, 并返回创建的新矩阵;
连接后的矩阵列为 a 与 b 的总和, 行不变;
a 与 b 的行数必须相同, 否则抛出异常.


## Matrix concatVertically(Matrix a, Matrix b)

垂直连接两个矩阵, 并返回创建的新矩阵;
连接后的矩阵行为 a 与 b 的总和, 列不变;
a 与 b 的列数必须相同, 否则抛出异常.


## Range rangeAll()

返回一个范围对象, 索引全部元素

## Range rangeIndices(int [] indices), rangeIndices(Matrix indices)

返回一个范围对象, 索引由 indices 提供的元素

## Range rangeInterval(int begin, int end)

返回一个范围对象, 索引从 begin(包含) 到 end(排除) 之间的元素

## Range rangePoint(int i)

返回一个范围对象, 索引一个点


# 子模块 eigen  `anchor=eigen`

特征值和特征向量相关函数。

存在用于处理对称矩阵或一般特征值的方法。 在对称矩阵上，对称版本通常要快得多。

调用方法: 

```javascript
var blas = require("blas");
blas.eigen.eigenvalues(...)
```

## Matrix symmetricEigenvalues(Matrix A)

计算对称矩阵的特征值。

## Matrix[] symmetricEigenvectors(Matrix A)

计算对称矩阵的特征值和特征向量。

返回值：

Matrix对象的数组，其中包含存储为第一矩阵的列的特征向量和作为第二矩阵的对角元素的特征值。

## ComplexMatrix eigenvalues(Matrix A)

计算通用矩阵的特征值。

## ComplexMatrix[] eigenvectors(Matrix A)

计算通用矩阵的特征值和特征向量。

返回值：

ComplexMatrix对象的数组，其中包含存储为第一矩阵的列的特征向量，以及存储为第二矩阵的对角元素的特征值。

## Matrix symmetricGeneralizedEigenvalues(Matrix A, Matrix B)

计算问题 `A x = L B x` 的广义特征值。

参数：

* A - 对称矩阵A。仅考虑上三角。
* B - 对称矩阵B。仅考虑上三角。

返回值：

特征值L的向量。

## Matrix[] symmetricGeneralizedEigenvectors(Matrix A, Matrix B)

解决一般问题 `A x = L B x`。

参数：

* A - 对称矩阵A
* B - 对称矩阵B

返回值：

长度为2的矩阵的数组。 第一个是特征向量X的数组。第二个是包含相应特征值L的向量。

## Matrix symmetricGeneralizedEigenvalues(Matrix A, Matrix B, double vl, double vu)

计算形式为 `A x = L B x` 或等效地`(A - L B)x = 0`的实广义对称定本征问题的选定特征值。
此处假定A和B是对称的，B也是正定的。 该选择基于期望特征值的给定值范围。
范围是半开的：(vl，vu]。

参数：

* A - 对称矩阵A。仅考虑上三角。
* B - 对称矩阵B。仅考虑上三角。
* vl - 要返回的最小特征值的下限
* vu - 要返回的最大特征值的上限

返回值：
 
特征值L的向量

## Matrix symmetricGeneralizedEigenvalues(Matrix A, Matrix B, int il, int iu)

计算形式为 `A x = L B x` 或等效地 `(A - L B)x = 0` 的实广义对称定本征问题的选定特征值。此处假定A和B是对称的，B也是正定的。 该选择基于期望特征值的给定索引范围。

参数：

* A - 对称矩阵A。仅考虑上三角。
* B - 对称矩阵B。仅考虑上三角。
* il - 要返回的最小特征值的下标（升序）（索引从0开始）
* iu - 要返回的最大特征值的上索引（升序）（索引从0开始）

返回值：

特征值L的向量

## Matrix[] symmetricGeneralizedEigenvectors(Matrix A, Matrix B, double vl, double vu)

计算形式为 `A x = L B x` 或等效地 `(A - L B)x = 0` 的实广义对称定本征问题的所选特征值及其对应的特征向量。此处假定A和B是对称的，并且B也为正定。 该选择基于期望特征值的给定值范围。 范围是半开的：(vl，vu]。

参数：

* A - 对称矩阵A。仅考虑上三角。
* B - 对称矩阵B。仅考虑上三角。
* vl - 要返回的最小特征值的下限
* vu - 要返回的最大特征值的上限

返回值：

长度为2的矩阵的数组。 第一个是特征向量x的数组。 第二个是包含相应特征值L的向量。

## Matrix[] symmetricGeneralizedEigenvectors(Matrix A, Matrix B, int il, int iu)

计算形式为 `A x = L B x` 或等效地 `(A - L B)x = 0` 的实广义对称定本征问题的所选特征值及其对应的特征向量。此处假定A和B是对称的，并且B也为正定。 该选择基于期望特征值的给定值范围。

参数：

* A - 对称矩阵A。仅考虑上三角。
* B - 对称矩阵B。仅考虑上三角。
* il - 要返回的最小特征值的下标（升序）（索引从0开始）
* iu - 要返回的最大特征值的上索引（升序）（索引从0开始）

返回值：

长度为2的矩阵的数组。 第一个是特征向量x的数组。 第二个是包含相应特征值L的向量。



# 子模块 geometry `anchor=geometry`

本质上是几何的一般功能。

例如，计算矩阵所有列之间的所有成对平方距离。

调用方法: 

```javascript
var blas = require("blas");
blas.geometry.center(...)
```

## Matrix pairwiseSquaredDistances(Matrix X, Matrix Y)

计算两个矩阵的所有列之间的成对平方距离。

一种有效的方法是观察 `(x-y)^2 = x^2 - 2xy - y^2`，然后适当地使用矩阵进行计算。

## Matrix center(Matrix x)

将向量居中（从所有元素中减去均值）（就地）

## Matrix centerRows(Matrix x)

使矩阵的行居中（就地）

## Matrix centerColumns(Matrix x)

将矩阵的列居中（就地）

## Matrix normalize(Matrix x)

归一化向量（缩放比例，使其欧几里得范数为1）（就地）

## Matrix normalizeRows(Matrix x)

归一化矩阵的行（就地）

## Matrix normalizeColumns(Matrix x)

归一化矩阵的列（就地）


# 子模块 solve `anchor=solve`

解线性方程。

调用方法: 

```javascript
var blas = require("blas");
blas.solve.pinv(...)
```

## Matrix solve(Matrix A, Matrix B)

求解线性方程 `A*X = B`.

## Matrix solveSymmetric(Matrix A, Matrix B)

对对称 A 求解线性方程 `A*X = B`.

## Matrix solvePositive(Matrix A, Matrix B)

对正定A的线性方程 `A*X = B` 求解。

## Matrix solveLeastSquares(Matrix A, Matrix B)

计算上或下线性方程组的最小二乘解 `A*X = B`, 在超定情况下，当 m>n 时，即方程组多于变量，它将计 `X -> ||A*X - B ||_2` 的最小二乘解 。 在不确定情况下，当m <n（方程少于变量）时，存在无限多个解，并且它计算最小范数解。

参数：

* A - 一个（m，n）矩阵
* B - 一个（m，k）矩阵

返回值：

最小范数或最小二乘法。

## Matrix pinv(Matrix A)

计算伪逆。 注意，该函数使用solveLeastSquares，对于未确定的情况，可能会产生与matlab不同的数值解。

参数：

* A - 矩形矩阵

返回值：

矩阵 P 使得 `A*P*A = A` 和 `P*A*P = P`.


# 子模块 singular `anchor=singular`

奇异值分解

调用方法: 

```javascript
var blas = require("blas");
blas.singular.fullSVD(...)
```

## Matrix[] fullSVD(Matrix A)

一个 Matrix[3]{U, S, V} 数组, 使得 `A = U * diag(S) * V'`

## ComplexMatrix[] fullSVD(ComplexMatrix A)

计算A的奇异值分解。

返回:

一个数组 ComplexMatrix[3]{U, S, V} 使得 `A = U * diag(S) * V'`


## Matrix[] sparseSVD(Matrix A)

计算A的奇异值分解（稀疏变体）。 稀疏意味着矩阵U和V不是正方形，而是仅具有必要的列数（或行数）。

返回:

一个数组 Matrix[3]{U, S, V} 使得 `A = U * diag(S) * V'`


## ComplexMatrix[] sparseSVD(ComplexMatrix A)

计算A的奇异值分解（稀疏变体）。 稀疏意味着矩阵U和V不是正方形，而是仅具有必要的列数（或行数）。

返回:

一个数组 ComplexMatrix[3]{U, S, V} 使得 `A = U * diag(S) * V'`


## Matrix SVDValues(Matrix A)

计算矩阵的奇异值。

参数：

* A - 尺寸 为m * n 的Matrix

返回值：

奇异值的 min(m，n) 向量。


## Matrix SVDValues(ComplexMatrix A)

计算复数矩阵的奇异值。

参数：

* A - 尺寸为 m * n 的 ComplexMatrix

返回值：

奇异值的实数 (!)min(m,n) 向量。


# 子模块 mf (Matrix Function) `anchor=mf`

矩阵函数

调用方法: 

```javascript
var blas = require("blas");
blas.mf.abs(...)
```

## Matrix absi(Matrix x)

将此矩阵中的所有元素设置为其绝对值。 请注意，此操作是就地的。

同功能函数:

* ComplexMatrix absi(ComplexMatrix x)
* double abs(double x)
* Matrix abs(Matrix x)

## Matrix acosi(Matrix x)

将三角反余弦函数应用于此矩阵的元素。 请注意，这是就地操作。

同功能函数:

* double	acos(double x) 
* Matrix	acos(Matrix x)

## Matrix asini(Matrix x)

将三角反正弦函数应用于此矩阵的元素。 请注意，这是就地操作。

同功能函数:

* double asin(double x) 
* Matrix asin(Matrix x)

## Matrix atani(Matrix x)

将三角反正切函应用于此矩阵的数元。 请注意，这是就地操作。

同功能函数:

* double atan(double x) 
* Matrix atan(Matrix x)

## Matrix cbrti(Matrix x)

将立方根函数地应用于此矩阵的元素。 请注意，这是就地操作。

同功能函数:

* double cbrt(double x)
* Matrix cbrt(Matrix x)

## Matrix ceili(Matrix x)

通过在每个元素上应用ceil函数来逐个元素地舍入。 请注意，这是就地操作。

同功能函数:

* double ceil(double x)
* Matrix ceil(Matrix x)

## Matrix cosi(Matrix x)

在该矩阵上逐元素应用余弦函数。 请注意，这是就地操作。

同功能函数:

* double cos(double x)
* Matrix cos(Matrix x)

## Matrix coshi(Matrix x)

在此矩阵上逐元素应用双曲余弦函数。 请注意，这是就地操作。

同功能函数:

* double cosh(double x)
* Matrix cosh(Matrix x)

## Matrix expi(Matrix x)

在此矩阵上逐元素应用指数函数。 请注意，这是就地操作。

同功能函数:

* double exp(double x)
* Matrix exp(Matrix x)

## Matrix expm(Matrix A)

计算方矩阵的矩阵指数。 使用了缩放的Pade近似算法。 该算法已直接从Golub＆Van Loan的“矩阵计算”（算法11.3.1）中翻译而来。 11.2中的特殊Horner技术也用于最小化矩阵乘法的次数。

## Matrix floori(Matrix x)

通过在每个元素上应用下移功能将元素逐个舍入。 请注意，这是就地操作。

同功能函数:

* double floor(double x)
* Matrix floor(Matrix x)

## Matrix logi(Matrix x)

在此矩阵上逐元素应用自然对数函数。 请注意，这是就地操作。

同功能函数:

* double log(double x)
* Matrix log(Matrix x)

## Matrix log10i(Matrix x)

在此矩阵上以10为单位对数应用对数函数。 请注意，这是就地操作。

同功能函数:

* double log10(double x)
* Matrix log10(Matrix x)

## Matrix powi(Matrix x, Matrix e)

逐元素幂函数。 用d的幂替换每个元素。请注意，这是就地操作。

同功能函数:

* double pow(double x, double y)
* Matrix pow(double b, Matrix x)
* Matrix pow(Matrix x, double e)
* Matrix powi(Matrix x, double d)
* Matrix powi(double base, Matrix x)

## Matrix signumi(Matrix x)

逐元素计算的符号函数; 如果参数为零，则为零;如果参数大于零，则为1.0f;如果参数小于零，则为-1.0f (就地)

同功能函数:

* double signum(double x)
* Matrix signum(Matrix x)

## Matrix sini(Matrix x)

逐元素应用 sin 函数, 就地操作.

同功能函数:

* double sin(double x)
* Matrix sin(Matrix x)

## Matrix sinhi(Matrix x)

逐元素应用(单位为角度)的双曲正弦值函数, 就地操作

同功能函数:

* double sinh(double x)
* Matrix sinh(Matrix x)

## Matrix sqrti(Matrix x)

逐元素应用平方根函数, 就地操作

同功能函数:

* double sqrt(double x)
* Matrix sqrt(Matrix x)

## Matrix tani(Matrix x)

逐元素应用正切函数, 就地操作

同功能函数:

* double tan(double x)
* Matrix tan(Matrix x)

## Matrix tanhi(Matrix x)

逐元素应用双曲正切函数, 就地操作

同功能函数:

* double tanh(double x)
* Matrix tanh(Matrix x)


# 类

## Range `anchor=range`

范围类, 用于索引矩阵中的元素, 
没有公共方法/属性可以访问.

调用方法: 

```javascript
blas.eigen.eigenvalues(...)
```


## Complex `anchor=complex`

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

### Complex addi(Complex c [, Complex result])

复数加法; result = this + c; 返回 result
如果忽略 result 参数, 则在 this 上进行操作

### Complex add(Complex c)

复数加法; result = this + c; 返回 result
不会修改 this.

### Complex addi(double a [, Complex result])

复数与实数加法; result = this + a; 返回 result

### Complex add(double c)

复数与实数加法; result = this + c; 返回 result

### Complex subi(Complex c [, Complex result])

复数减法; result = this - c; 返回 result

### Complex sub(Complex c)

复数减法

### Complex subi(double a [, Complex result])

复数与实数减法

### Complex sub(double r)

复数与实数减法

### Complex muli(Complex c [, Complex result])

复数乘法

### Complex mul(Complex c)

复数乘法

### Complex mul(double v)

复数与实数乘法

### Complex muli(double v [, Complex result])

复数与实数乘法

### Complex div(Complex c)

复数除法; result = this / c; 返回 result

### Complex divi(Complex c [, Complex result])

复数除法

### Complex divi(double v [, Complex result])

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


## ComplexMatrix `anchor=ComplexMatrix`

复数二维矩阵类


### 属性 rows : int

矩阵行数, 修改这个属性会导致不可预料的错误

### 属性 columns : int

矩阵列数, 修改这个属性会导致不可预料的错误

### 属性 length : int

矩阵元素数量, 修改这个属性会导致不可预料的错误

### 属性 data : double[]

底层数组, 这是一个一维数组, 在逻辑上通过 rows/columns 属性表示一个矩阵,
在偶数索引的上元素表示实数部分, 奇数索引上的元素表示虚数, 一个复数用两个数组中的元素表示;
该 data.length 等于属性 length 的 2 倍;
修改这个属性会导致不可预料的错误;


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

`this = this + alpha * x * y'`; 返回 this

### ComplexMatrix rankOneUpdate(double alpha, ComplexMatrix x, ComplexMatrix y)

`this = this + alpha * x * y'`; 返回 this

### ComplexMatrix rankOneUpdate(double alpha, ComplexMatrix x)

`this = this + alpha * x * x'`

### ComplexMatrix rankOneUpdate(Complex alpha, ComplexMatrix x)

`this = this + alpha * x * x'`

### ComplexMatrix rankOneUpdate(ComplexMatrix x)

`this = this + x * x'`

### ComplexMatrix rankOneUpdate(ComplexMatrix x, ComplexMatrix y)

`this = this + x * y'`

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

同功能函数: 

* ComplexMatrix eqi(Complex value [, ComplexMatrix result])
* ComplexMatrix eqi(double value [, ComplexMatrix result])


### ComplexMatrix eq(ComplexMatrix other)

矩阵 this 与 other 逐元素比较, 相等结果为 1 否则为 0, 将结果保存在 this 矩阵中.

同功能函数: 

* ComplexMatrix eq(Complex value)
* ComplexMatrix eq(double value)


### ComplexMatrix nei(ComplexMatrix other [, ComplexMatrix result])

结果与 eq 相反, 不相等为 1.

同功能函数: 

* ComplexMatrix nei(Complex value [, ComplexMatrix result])
* ComplexMatrix nei(double value [, ComplexMatrix result])
* ComplexMatrix ne(ComplexMatrix other)
* ComplexMatrix ne(Complex value)
* ComplexMatrix ne(double value)


### ComplexMatrix andi(ComplexMatrix other [, ComplexMatrix result])

矩阵 this 与 other 逐元素比较, 都不为 0 值结果为 1 否则为 0, 将结果保存在 result 矩阵中.
省略 result 则结果保存在 this 中, 返回 result.

同功能函数: 

* ComplexMatrix andi(Complex value [, ComplexMatrix result])
* ComplexMatrix andi(double value [, ComplexMatrix result])
* ComplexMatrix and(ComplexMatrix other)
* ComplexMatrix and(Complex value)
* ComplexMatrix and(double value)


### ComplexMatrix ori(ComplexMatrix other [, ComplexMatrix result])

矩阵 this 与 other 逐元素比较, 任意值为 1 则结果为 1 否则为 0, 将结果保存在 result 矩阵中.
省略 result 则结果保存在 this 中, 返回 result.

同功能函数: 

* ComplexMatrix ori(Complex value [, ComplexMatrix result])
* ComplexMatrix ori(double value [, ComplexMatrix result])
* ComplexMatrix or(ComplexMatrix other)
* ComplexMatrix or(Complex value)
* ComplexMatrix or(double value)


### ComplexMatrix xori(ComplexMatrix other [, ComplexMatrix result])

矩阵 this 与 other 逐元素比较, 同时为零或同时非零则结果为 0 否则为 1, 将结果保存在 result 矩阵中.
省略 result 则结果保存在 this 中, 返回 result.

同功能函数: 

* ComplexMatrix xori(Complex value [, ComplexMatrix result])
* ComplexMatrix xori(double value [, ComplexMatrix result])
* ComplexMatrix xor(ComplexMatrix other)
* ComplexMatrix xor(Complex value)
* ComplexMatrix xor(double value)


## Matrix `anchor=matrix`

实数二维矩阵类

### 属性 rows : int

矩阵行数, 修改这个属性会导致不可预料的错误

### 属性 columns : int

矩阵列数, 修改这个属性会导致不可预料的错误

### 属性 length : int

矩阵元素数量, 修改这个属性会导致不可预料的错误

### 属性 data : double[]

底层数组, 这是一个一维数组, 在逻辑上通过 rows/columns 属性表示一个矩阵,
在偶数索引的上元素表示实数部分, 奇数索引上的元素表示虚数, 一个复数用两个数组中的元素表示;
该 data.length 等于属性 length 的 2 倍;
修改这个属性会导致不可预料的错误;


### boolean isScalar()

是标量返回 true (只有一个元素)

### double scalar()

返回标量的值


### Matrix get(int[] indices), Matrix get(Matrix indices)

创建并返回 indices.length 行 1 列的矩阵, 元素复制自 indices 索引当前矩阵中的值. 如索引 2 行 3列中的元素, 索引等于 6.

### Matrix get(int r, int[] indices), Matrix get(int r, Matrix indices)

indices 中的索引从 r 行开始计算

### Matrix get(int[] indices, int c), Matrix get(Matrix indices, int c)

indices 中的索引从 c 列开始计算

### Matrix get(int[] rindices, int[] cindices), Matrix get(Matrix rindices, Matrix cindices)

创建并返回 rindices.length 行 cindices.length 列的矩阵, 元素复制自 rindices/cindices 索引当前矩阵中的值.

### Matrix get(Range rs, Range cs)

返回从当前矩阵中选中指定的行/列

### Matrix get(Range rs, int c)

在指定的 c 列中选中元素

### Matrix get(int r, Range cs)

在指定的 r 行中选中元素


### Matrix getRange(int a, int b)

返回从 a 开始, 到 b(排除) 为止的元素.

### Matrix getColumnRange(int r, int a, int b)

返回 r 行 a 列到 b(排除) 列的元素.

### Matrix getRowRange(int a, int b, int c)

返回 a 列, 从 b 行到 c 行之间的元素.

### Matrix getRange(int ra, int rb, int ca, int cb)

返回 ra 行到 rb(排除) 行,  ca 列到 cb(排除) 列的元素.


### Matrix getRows(int[] rindices), getRows(Matrix rindices)

返回 rindices 指定行的元素.

### Matrix getRows(Range indices, Matrix result)

rindices 指定行的元素保存到 result 中, 返回 result.

### Matrix getRows(Range indices)


返回 indices 范围中指定行的元素.

### Matrix getColumns(int[] cindices), Matrix getColumns(Matrix cindices)

返回 cindices 指定列中的元素

### Matrix getColumns(Range indices, Matrix result)

indices 指定列中的元素保存到 result 中, 返回 result

### Matrix getColumns(Range indices)

返回 indices 指定列中的元素

### void checkLength(int l)

如果元素数量不等于 l 则抛出异常

### void checkRows(int r)

如果矩阵行数不等于 r 则抛出异常

### void checkColumns(int c)

如果矩阵列数不等于 c 则抛出异常

### Matrix put(int[] indices, Matrix x), put(Matrix indices, Matrix x)

用 indices 索引 this 中对应的元素, 用 x 中的值覆盖;

例子: a.put(new int[]{ 1, 2, 0 }, new Matrix(3, 1, 2.0, 4.0, 8.0) 
相当于:  a.put(1, 2.0), a.put(2, 4.0), a.put(0, 8.0)

### Matrix put(int r, int[] indices, Matrix x), put(int r, Matrix indices, Matrix x)

从 r 行开始, 用 indices 索引 this 中对应的元素, 用 x 中的值覆盖;

### Matrix put(int[] indices, int c, Matrix x), put(Matrix indices, int c, Matrix x)

从 c 列开始, 用 indices 索引 this 中对应的元素, 用 x 中的值覆盖;

### Matrix put(int[] rindices, int[] cindices, Matrix x), put(Matrix rindices, Matrix cindices, Matrix x)

用 rindices/cindices 索引 this 中对应的元素, 用 x 中的值覆盖;
rindices 长度必须和 x 行数相等; cindices 长度必须和 x 列数相等;

### Matrix put(Range rs, Range cs, Matrix x)

用 rs/cs 索引 this 中对应的元素, 用 x 中的值覆盖;

### Matrix put(int[] indices, double v), put(Matrix indices, double v)

用 indices 索引 this 中对应的元素, 用 v 覆盖;

### Matrix put(int r, int[] indices, double v), put(int r, Matrix indices, double v)

从 r 行开始, 用 indices 索引 this 中对应的元素, 用 v 覆盖;

### Matrix put(int[] indices, int c, double v), put(Matrix indices, int c, double v)

从 c 列开始, 用 indices 索引 this 中对应的元素, 用 v 覆盖;

### Matrix put(int[] rindices, int[] cindices, double v), put(Matrix rindices, Matrix cindices, double v)

用 rindices/cindices 索引 this 中对应的元素, 用 v 覆盖;

### int[] findIndices()

用当前矩阵的非零值处的索引构建一个数组返回.

### Matrix transpose()

返回当前矩阵的拷贝

### boolean compare(Matrix other, double tolerance)

比较两个矩阵, 当且仅当 other 也是尺寸相同且矩阵元素的最大绝对差小于指定的 tolerance 时返回true.

### boolean equals(Object o)

当 o 与当前矩阵完全相同时返回 true

### void resize(int newRows, int newColumns)

重设矩阵大小, 这会清除所有数据

### Matrix reshape(int newRows, int newColumns)

在元素数量不变的情况下重设矩阵形状(3x2 变成 2x3), 数量如果改变会抛出异常, 返回 this

### Matrix repmat(int rowMult, int columnMult)

倍增矩阵; 生成一个新矩阵 rowMult 倍行数, columnMult 倍列数, 元素值在行列上重复.

### boolean sameSize(Matrix a)

如果矩阵形状相同返回 true

### void assertSameSize(Matrix a)

如果形状不同会抛出异常

### boolean multipliesWith(Matrix a)

检查两个矩阵是否可以相乘（this * a 即此矩阵的列数必须等于a的行数）

### void assertMultipliesWith(Matrix a)

如果两个矩阵不能相乘, 会抛出异常

### boolean sameLength(Matrix a)

矩阵元素数量相同返回 true

### void assertSameLength(Matrix a)

如果矩阵元素数量不同会抛出异常

### Matrix copy(Matrix a)

拷贝 a 的所有元素到 this, 如果 this 比较小会被重设 (resize).

### Matrix dup()

返回当前矩阵的转置矩阵

### Matrix swapColumns(int i, int j)

交换 i, j 列中的元素; 返回 this

### Matrix swapRows(int i, int j)

交换 i, j 行中的元素; 返回 this

### Matrix put(int rowIndex, int columnIndex, double value)

设置指定位置的元素值; 返回 this

### double get(int rowIndex, int columnIndex)

获得指定位置的元素值;

### int index(int rowIndex, int columnIndex)

获取矩阵索引对应底层数组的索引

### int indexRows(int i)

获取矩阵第 i 行索引对应底层数组的索引

### int indexColumns(int i)

获取矩阵第 i 列索引对应底层数组的索引

### double get(int i)

返回底层数组索引处元素的值

### Matrix put(int i, double v)

设置底层数组索引处元素的值

### Matrix fill(double value)

用 value 填充矩阵

### int getRows()

返回行数 

### int getColumns()

返回列数

### int getLength()

返回矩阵元素数量

### boolean isEmpty()

空矩阵返回 true, (0 行或 0 列)

### boolean isSquare()

是方阵返回 true

### void assertSquare()

如果不是方阵则抛出异常 

### boolean isVector()

是向量返回 true

### boolean isRowVector()

是行向量返回 true 

### boolean isColumnVector()

是列向量返回 true

### Matrix diag()

返回当前矩阵的对角矩阵

### double[] toArray()

返回底层数组的副本

### double[][] toArray2()

用当前矩阵的行列构建一个副本

### int[] toIntArray()

返回底层数组的副本, 类型转换为 int

### int[][] toIntArray2()

### boolean[] toBooleanArray()

### boolean[][] toBooleanArray2()

### Matrix addi(Matrix other [, Matrix result])

逐元素加法, 结果保存在 result 中, 返回 result, 如果未设置参数 result 则用 this.

同功能函数:

* Matrix addi(Matrix other)
* Matrix addi(double v [, Matrix result])
* Matrix add(double v)

### Matrix subi(Matrix other [, Matrix result])

逐元素减法 this - other, 结果保存在 result 中, 返回 result, 如果未设置参数 result 则用 this.

同功能函数:

* Matrix sub(Matrix other)
* Matrix subi(double v [, Matrix result])
* Matrix sub(double v)

### Matrix rsubi(Matrix other [, Matrix result])

逐元素减法 other - this, 结果保存在 result 中, 返回 result, 如果未设置参数 result 则用 this.

同功能函数:

* Matrix rsub(Matrix other)
* Matrix rsubi(double a [, Matrix result])
* Matrix rsub(double v)

### Matrix muli(Matrix other [, Matrix result])

逐元素乘法, 结果保存在 result 中, 返回 result, 如果未设置参数 result 则用 this.

同功能函数:

* Matrix mul(Matrix other)
* Matrix muli(double v, Matrix result), 
* Matrix mul(double v)

### Matrix mmuli(Matrix other [, Matrix result])

矩阵乘法 this * other, 结果保存在 result 中, 返回 result, 如果未设置参数 result 则用 this.

### Matrix divi(Matrix other [, Matrix result])

逐元素除法 this / other, 结果保存在 result 中, 返回 result, 如果未设置参数 result 则用 this.

同功能函数:

* Matrix div(Matrix other)
* Matrix divi(double a [, Matrix result])
* Matrix div(double v)

### Matrix rdivi(Matrix other [, Matrix result])

逐元素除法 other / this, 结果保存在 result 中, 返回 result, 如果未设置参数 result 则用 this.

同功能函数:

* Matrix rdivi(Matrix other)
* Matrix rdivi(double a [, Matrix result])
* Matrix rdiv(double v)

a / this

### Matrix negi()

取反当前矩阵每个元素, 返回 this

### Matrix neg()

取反当前矩阵副本的每个元素, 并返回

### Matrix noti()

修改当前矩阵每个元素, 0 变为 1, 非 0 变为 0, 返回 this

### Matrix not()

创建并返回当前矩阵的副本, 其中每个元素, 0 变为 1, 非 0 变为 0

### Matrix truthi()

修改当前矩阵每个元素, 0 保持 0, 非 0 变为 1, 返回 this

### Matrix truth()

创建并返回当前矩阵的副本, 其中每个元素, 0 保持 0, 非 0 变为 1

### Matrix isNaNi()

修改当前矩阵每个元素, 非数字为 1, 否则为 0, 返回 this

### Matrix isNaN()

创建并返回当前矩阵的副本, 非数字为 1, 否则为 0

### Matrix isInfinitei()

修改当前矩阵每个元素, 无穷大的值为 1, 否则为 0, 返回 this

### Matrix isInfinite()

创建并返回当前矩阵的副本, 无穷大的值为 1, 否则为 0

### boolean isLowerTriangular()

是正三角返回 true

### boolean isUpperTriangular()

是倒立三角形返回 true

### Matrix selecti(Matrix where)

当前矩阵中对应 where 矩阵, 如果 where 元素为 0 则设置当前矩阵元素为 0, 否则元素值不变. 返回 this.

### Matrix select(Matrix where)

在当前矩阵的副本上做 selecti()

### Matrix rankOneUpdate(double alpha, Matrix x, Matrix y)

`this = this + alpha * x * y'`

### Matrix rankOneUpdate(double alpha, Matrix x)

`this = this + alpha * x * x'`

### Matrix rankOneUpdate(Matrix x)

`this = this + x * x'`

### Matrix rankOneUpdate(Matrix x, Matrix y)

`this = this + x * y'`

### double min()

返回矩阵中的最小元素

### int argmin()

返回最小元素的线性索引。 如果此值有多个元素，则返回第一个。

### Matrix mini(Matrix other [, Matrix result]), mini(double v [, Matrix result])

逐元素比较 this 与 other/v, 较小的值放入 result 中, 返回 result;
如果 result 参数未设置则使用 this.

### Matrix min(Matrix other)

在 this 上执行 mini()

### Matrix min(double v)

### double max()

返回矩阵中的最大元素

### int argmax()

返回最大元素的线性索引。 如果此值有多个元素，则返回第一个。

### Matrix maxi(Matrix other [, Matrix result]), maxi(double v, Matrix result)

逐元素比较 this 与 other/v, 较大的值放入 result 中, 返回 result;
如果 result 参数未设置则使用 this.

### Matrix max(Matrix other)

在 this 上执行 maxi()

### Matrix maxi(double v)

在 this 上执行 maxi()

### Matrix max(double v)


### double sum()

返回所有元素的和

### double prod()

返回所有元素的积

### double mean()

返回所有元素的平均值

### Matrix cumulativeSumi()

使当前矩阵的每个元素是当前索引之前(包含当前元素)所有元素的和

### Matrix cumulativeSum()

返回一个矩阵, 每个元素是当前索引之前(包含当前元素)所有元素的和

### double dot(Matrix other)

返回 this 与 other 的标量积, 即 this 与 other 对应元素的积的总和

### double project(Matrix other)

计算 other 在 this 上的投影

### double norm2()

计算向量的欧几里德长度

### double normmax()

返回矩阵中最大的元素的绝对值

### double norm1()

计算向量中元素绝对值之和

### double squaredDistance(Matrix other)

返回平方（欧几里得）距离

### double distance2(Matrix other)

返回（欧几里得）距离

### double distance1(Matrix other)

返回（1-范数）距离

### Matrix sort()

返回排序后的矩阵

### Matrix sorti()

原地排序并返回 this

### int[] sortingPermutation()

返回一个int []数组, 以便按排序顺序对元素进行索引

### Matrix sortColumnsi()

将每行数据单独进行排序, 修改 this

### Matrix sortColumns()

将每行数据单独进行排序, 返回副本

### int[][] columnSortingPermutations()

返回对所有列进行排序的索引矩阵

### Matrix sortRowsi()

将每列数据单独排序, 修改 this

### Matrix sortRows()

将每列数据单独排序, 返回副本

### int[][] rowSortingPermutations()

返回对所有行进行排序的索引矩阵

### Matrix columnSums()

返回一个包含每列总和的向量

### Matrix columnMeans()

返回一个包含所有列均值的向量

### Matrix rowSums()

返回一个包含每行总和的向量

### Matrix rowMeans()

返回一个包含所有行均值的向量

### Matrix getColumn(int c)

返回 c 列的副本

### Matrix getColumn(int c, Matrix result)

c 列的复制到 result 中, 返回 result

### void putColumn(int c, Matrix v)

设置 c 列为 v

### Matrix getRow(int r)

返回 r行的副本

### Matrix getRow(int r, Matrix result)

r 行复制到 result 中, 返回 result

### void putRow(int r, Matrix v)

设置 r 行为 v 

### Matrix columnMins()

返回包含所有列中最小值的向量

### int[] columnArgmins()

返回包含所有列中最小值元素索引的向量

### Matrix columnMaxs()

返回包含所有列中最大值的向量

### int[] columnArgmaxs()

返回包含所有列中最大值元素索引的向量

### Matrix rowMins()

返回包含所有行中最小值的向量

### int[] rowArgmins()

返回包含所有行中最小值元素索引的向量

### Matrix rowMaxs()

返回包含所有行中最大值的向量

### int[] rowArgmaxs()


返回包含所有行中最大值元素索引的向量

### Matrix addiRowVector(Matrix x)

this 的每行与 x 行向量相加, 返回 this

### Matrix addRowVector(Matrix x)

this 的副本每行与 x 行向量相加, 返回副本

### Matrix addiColumnVector(Matrix x)

this 的每列与 x 列向量相加, 返回 this

### Matrix addColumnVector(Matrix x)

this 的副本每列与 x 列向量相加, 返回副本


### Matrix subiRowVector(Matrix x)

this 的每行与 x 行向量相减, 返回 this

### Matrix subRowVector(Matrix x)

this 的副本每行与 x 行向量相减, 返回副本

### Matrix subiColumnVector(Matrix x)

this 的每列与 x 列向量相减, 返回 this

### Matrix subColumnVector(Matrix x)

this 的副本每列与 x 列向量相减, 返回副本


### Matrix mulRow(int r, double scale)

this 的 r 行与标量相乘, 返回 this

### Matrix mulColumn(int c, double scale)

this 的 c 列与标量相乘, 返回 this


### Matrix muliColumnVector(Matrix x)

this 的每列与 x 列向量相乘, 返回 this

### Matrix mulColumnVector(Matrix x)

this 的副本每列与 x 列向量相乘, 返回副本

### Matrix muliRowVector(Matrix x)

this 的每行与 x 行向量相乘, 返回 this

### Matrix mulRowVector(Matrix x)

this 的副本每行与 x 行向量相乘, 返回副本


### Matrix diviRowVector(Matrix x)

this 的每列与 x 行向量相除, 返回 this

### Matrix divRowVector(Matrix x)

this 的副本每列与 x 行向量相除, 返回副本

### Matrix diviColumnVector(Matrix x)

this 的每列与 x 列向量相除, 返回 this

### Matrix divColumnVector(Matrix x)

this 的副本每列与 x 列向量相除, 返回副本

### Matrix lti(Matrix other [, Matrix result])

逐元素比较, 如果 this < other 结果为 1 否则为零, 存入 result 并返回 result
没有result 则在 this 上操作.

同功能函数:

* Matrix lt(Matrix other)
* Matrix lt(double value)
* Matrix lti(double value [, Matrix result])

### Matrix gti(Matrix other [, Matrix result])

逐元素比较, 如果 this > other 结果为 1 否则为零, 存入 result 并返回 result
没有result 则在 this 上操作.

同功能函数:

* Matrix gt(Matrix other)
* Matrix gt(double value)
* Matrix gti(double value [, Matrix result])

### Matrix lei(Matrix other [, Matrix result])

逐元素比较, 如果 this <= other 结果为 1 否则为零, 存入 result 并返回 result
没有result 则在 this 上操作.

同功能函数:

* Matrix le(Matrix other)
* Matrix lei(double value, Matrix result)
* Matrix lei(double value)
* Matrix le(double value)
 
### Matrix gei(Matrix other [, Matrix result])

逐元素比较, 如果 this >= other 结果为 1 否则为零, 存入 result 并返回 result
没有result 则在 this 上操作.

同功能函数:

* Matrix ge(Matrix other)
* Matrix gei(double value, Matrix result)
* Matrix gei(double value)
* Matrix ge(double value)

### Matrix eqi(Matrix other [, Matrix result])

逐元素比较, 如果 this == other 结果为 1 否则为零, 存入 result 并返回 result
没有result 则在 this 上操作.

同功能函数:

* Matrix eq(Matrix other)
* Matrix eqi(double value, Matrix result)
* Matrix eqi(double value)
* Matrix eq(double value)
 
### Matrix nei(Matrix other [, Matrix result])

逐元素比较, 如果 this != other 结果为 1 否则为零, 存入 result 并返回 result
没有result 则在 this 上操作.

同功能函数:

* Matrix ne(Matrix other)
* Matrix nei(double value, Matrix result)
* Matrix nei(double value)
* Matrix ne(double value)
 
### Matrix andi(Matrix other [, Matrix result])

逐元素比较, 如果 this 和 other 都不为零结果为 1 否则为零, 存入 result 并返回 result
没有result 则在 this 上操作.

同功能函数:

* Matrix and(Matrix other)
* Matrix andi(double value, Matrix result)
* Matrix andi(double value)
* Matrix and(double value)

### Matrix ori(Matrix other [, Matrix result])

逐元素比较, 如果 this 或 other 不为零结果为 1 否则为零, 存入 result 并返回 result
没有result 则在 this 上操作.

同功能函数:

* Matrix or(Matrix other)
* Matrix ori(double value, Matrix result)
* Matrix ori(double value)
* Matrix or(double value)
 
### Matrix xori(Matrix other [, Matrix result])

逐元素比较, 如果 this 或 other 只有一个为零结果为 1 否则为零, 存入 result 并返回 result
没有result 则在 this 上操作.

同功能函数:

* Matrix xor(Matrix other)
* Matrix xori(double value, Matrix result)
* Matrix xori(double value)
* Matrix xor(double value)

### ComplexMatrix toComplex()

转换为复数矩阵
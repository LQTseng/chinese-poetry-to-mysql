<img src="https://qpic.ws/images/2024/01/15/Kzm5DC.jpg" alt="DartNode" width="300">

# chinese-poetry-to-mysql
诗词数据来源于 [chinese-poetry-npm](https://github.com/chinese-poetry/chinese-poetry-npm)
## 说明
 + 本脚本需要node.js环境，请自行配置，安装mysql和chinese-poetry模块，也可以使用 `npm install` 命令自动安装，运行 `node convert.js` 
+ 数据库为chinese_poetry，字符集使用utf8mb4
+ 已实现转换的有唐宋诗、宋词、论语、曹操诗集、诗经、花间集、南唐
## 表结构
唐诗（tang_poetry）宋诗（song_poetry）
```sql
create table tang_poetry (
  id int(11) not null primary key auto_increment,
  author varchar(255) not null,
  title varchar(255) not null,
  tags varchar(255),
  content text not null,
  poem_id CHAR(36) not null
) charset=utf8mb4;
```
唐诗作者（tang_poetry_author）宋诗作者（song_poetry_author）
```sql
create table tang_poetry_author (
  id int(11) not null primary key auto_increment,
  name varchar(255) not null,
  description text,
  author_id CHAR(36) not null
) charset=utf8mb4;
```
宋词
```sql
create table song_ci (
  id int(11) not null primary key auto_increment,
  author varchar(255) not null,
  rhythmic varchar(255) not null,
  tags varchar(255),
  content text not null
) charset=utf8mb4;
```
宋词作者
```sql
create table song_ci_author (
  id int(11) not null primary key auto_increment,
  name varchar(255) not null,
  short_description text,
  description text
) charset=utf8mb4;
```
曹操诗集
```sql
create table caocaoshiji (
  id int(11) not null primary key auto_increment,
  title varchar(255) not null,
  content text not null
) charset=utf8mb4;
```
论语
```sql
create table lunyu (
  id int(11) not null primary key auto_increment,
  chapter varchar(255) not null,
  content text not null
) charset=utf8mb4;
```
诗经
```sql
create table shijing (
  id int(11) not null primary key auto_increment,
  title varchar(255) not null,
  chapter varchar(255) not null,
  section varchar(255) not null,
  content text not null
) charset=utf8mb4;
```
五代十国：南唐（nantang）花间集（huajianji）
```sql
create table nantang (
  id int(11) not null primary key auto_increment,
  title varchar(255) not null,
  author varchar(255) not null,
  rhythmic varchar(255) not null,
  content text not null,
  notes text not null
) charset=utf8mb4;
```
作者（包含唐诗、宋诗、宋词、南唐）
```sql
create table poet (
  id int(11) not null primary key auto_increment,
  name varchar(255) not null,
  description text
) charset=utf8mb4;
```
诗词知名度：唐诗（tang_poetry_popularity）宋诗（song_poetry_popularity）
>唐宋诗把rhythmic字段名改为title
```sql
create table song_ci_popularity (
  id int(11) not null primary key auto_increment,
  author varchar(255) not null,
  rhythmic varchar(255) not null,
  baidu int(11),
  google int(11),
  so360 int(11),
  bing int(11),
  bing_en int(11)
) charset=utf8mb4;
```

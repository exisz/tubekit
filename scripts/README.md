# TubeKit scripts

TubeKit 不需要批量爬虫：核心数据来自 YouTube 公开 URL 结构与 oEmbed endpoint。

## 当前数据源
- Thumbnail: `https://img.youtube.com/vi/{videoId}/{quality}.jpg`
- Metadata: `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v={videoId}&format=json`

## 限制
- YouTube live view/like/comment stats 和真实视频 tags 需要 YouTube Data API key；当前版本不存储 key，不调用付费 API。
- 完整版可增加一个 server route，读取环境变量 `YOUTUBE_API_KEY` 后调用 YouTube Data API v3。

## 爬虫声明
无批量爬虫。若后续要做竞品关键词样本采集，必须使用 workspace `web-crawl` skill 的 `crawl4ai_safe.py --timeout 300`，单次抓取限制 2 分钟。
